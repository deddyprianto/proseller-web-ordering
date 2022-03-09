import { CONSTANT } from '../../helpers';
import { CRMService } from '../../Services/CRMService';
import _ from 'lodash';

function getCampaignStamps(payload = null) {
  return async (dispatch) => {
    let response = await CRMService.api(
      'GET',
      payload,
      'customer/stamps',
      'bearer'
    );
    if (response.ResultCode >= 400 || response.resultCode >= 400)
      console.log(response);
    else {
      if (
        response.Data &&
        response.Data.stamps &&
        response.Data.stamps.stampsItem
      ) {
        let dataStamps = [],
          isi = [],
          stampsTrueItem,
          stampsDetail;
        for (let i = 1; i <= response.Data.stamps.stampsItem.length; i++) {
          isi.push(response.Data.stamps.stampsItem[i - 1]);
          if (i % 5 === 0) {
            dataStamps.push(isi);
            isi = [];
          }
          if (i === response.Data.stamps.stampsItem.length) {
            if (isi.length > 0) dataStamps.push(isi);
          }
        }
        stampsDetail = {
          stampsTitle: response.Data.stamps.stampsTitle,
          stampsDesc: response.Data.stamps.stampsDesc,
          stampsSubTitle: response.Data.stamps.stampsSubTitle,
          maxStampsItemPerVisit: response.Data.stamps.maxStampsItemPerVisit,
          todayStampsCount: response.Data.stamps.todayStampsCount,
          maxStampsPerDay: response.Data.stamps.maxStampsPerDay,
          expiryDate: response.Data.expiryDate,
        };
        stampsTrueItem = _.filter(
          response.Data.stamps.stampsItem,
          _.iteratee(['stampsStatus', true])
        );

        let dataStampsRatio = `${stampsTrueItem.length}":"${response.Data.stamps.stampsItem.length}`;
        let campaignStampsAnnouncement = false;

        if (
          response.Data.trigger &&
          response.Data.trigger.campaignTrigger === 'COMPLETE_PROFILE' &&
          !response.Data.trigger.status
        ) {
          campaignStampsAnnouncement = true;
        }

        if (
          dataStamps &&
          dataStampsRatio &&
          dataStamps.length > 0 &&
          dataStamps[0][dataStampsRatio.split(':')[0]] &&
          dataStamps[0][dataStampsRatio.split(':')[0]].reward
        ) {
          let image =
            dataStamps[0][dataStampsRatio.split(':')[0]].reward.imageURL;
          this.setState({ image });
        }

        response.Data = {
          dataStampsRasio: dataStampsRatio,
          dataStamps,
          campaignStampsAnnouncement,
          stampsDetail,
        };
      }
    }
    dispatch(setData(response, CONSTANT.KEY_GET_CAMPAIGN_STAMPS));
    return response;
  };
}

function getCampaignPoints(payload = null, companyId = null) {
  return async (dispatch) => {
    let response = await CRMService.api(
      'GET',
      payload,
      'customer/point',
      'bearer'
    );
    if (response.ResultCode >= 400 || response.resultCode >= 400)
      console.log(response);
    else {
      let totalPoint = response.Data.campaignActive
        ? response.Data.totalPoint
        : 0;
      let campaignPointActive = response.Data.campaignActive;
      let pointsToRebateRatio = response.Data.pointsToRebateRatio || '0:0';
      let campaignPointAnnouncement = false;

      let response_ = await dispatch(getCampaignByPoints({ companyId }));
      let netSpendToPoint = '0:0';
      let roundingOptions = 'INTEGER';
      if (response_.ResultCode === 200 && response_.Data.length > 0) {
        response_ = response_.Data[0];
        roundingOptions = response_.points.roundingOptions;
        netSpendToPoint =
          response_.points.netSpendToPoint0 === undefined
            ? '0:0'
            : `${response_.points.netSpendToPoint0}:${response_.points.netSpendToPoint1}`;
      }
      let history = _.groupBy(response.Data.history, 'expiryDate');
      let historyGroup = [];
      _.forEach(history, (group) => {
        let pointBalance = 0;
        let pointDebit = 0;
        let pointKredit = 0;
        group.forEach((items) => {
          pointBalance += items.pointBalance;
          pointDebit += items.pointDebit;
          pointKredit += items.pointKredit;
        });
        group[0].pointBalance = pointBalance;
        group[0].pointDebit = pointDebit;
        group[0].pointKredit = pointKredit;
        historyGroup.push(group[0]);
      });
      // console.log(historyGroup)

      let detailPoint = {
        point: totalPoint,
        detail: historyGroup,
        netSpendToPoint,
        roundingOptions,
      };

      if (
        response.Data.trigger &&
        response.Data.trigger.campaignTrigger === 'COMPLETE_PROFILE' &&
        !response.Data.trigger.status
      ) {
        campaignPointAnnouncement = true;
      }

      response.Data = {
        pendingPoints: response.Data.pendingPoints,
        lockPoints: response.Data.lockPoints || 0,
        defaultPoints: response.Data.defaultPoints || 0,
        totalPoint,
        campaignPointActive,
        campaignPointAnnouncement,
        detailPoint,
        pointsToRebateRatio,
        xstep: roundingOptions === 'DECIMAL' ? 0.01 : 1,
      };
    }
    dispatch(setData(response, CONSTANT.KEY_GET_CAMPAIGN_POINTS));
    return response;
  };
}

function getCampaignByPoints(payload = null) {
  return async (dispatch) => {
    let response = await CRMService.api(
      'GET',
      payload,
      'campaign/points',
      'bearer'
    );
    if (response.ResultCode >= 400 || response.resultCode >= 400)
      console.log(response);
    dispatch(setData(response, CONSTANT.KEY_GET_CAMPAIGN_BY_POINTS));
    return response;
  };
}

function setData(data, constant) {
  return {
    type: constant,
    data: data.Data,
  };
}

export const CampaignAction = {
  getCampaignPoints,
  getCampaignStamps,
  getCampaignByPoints,
};
