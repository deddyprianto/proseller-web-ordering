import { CONSTANT } from '../../helpers';
import { CRMService } from '../../Services/CRMService';
import _ from 'lodash';

function getCampaignStamps() {
  return async (dispatch) => {
    const response = await CRMService.api(
      'GET',
      null,
      'customer/stamps',
      'bearer'
    );
    if (response.ResultCode >= 400 || response.resultCode >= 400) {
      dispatch(setData(null, CONSTANT.GET_CAMPAIGN_STAMPS));
    }

    if (
      response.data &&
      response.data.stamps &&
      response.data.stamps.stampsItem
    ) {
      const { stamps, expiryDate, trigger } = response.data;
      const {
        stampsTitle,
        stampsDesc,
        stampsSubTitle,
        stampsItem,
        emptyStampImage,
      } = stamps;
      const totalStampsEarned = stampsItem.reduce((acc, item) => {
        if (item.stampsStatus === true) {
          return acc + 1;
        }
        return acc;
      }, 0);

      const campaignStampsAnnouncement =
        trigger &&
        trigger.campaignTrigger === 'COMPLETE_PROFILE' &&
        !trigger.status;

      const stampsImage =
        totalStampsEarned < 1
          ? emptyStampImage
          : stampsItem[totalStampsEarned - 1].reward.imageURL;

      const payload = {
        totalStampsEarned,
        stampsTitle,
        stampsDesc,
        stampsSubTitle,
        expiryDate,
        stampsItem,
        campaignStampsAnnouncement,
        ...(stampsImage && { stampsImage }),
      };
      dispatch({ type: CONSTANT.GET_CAMPAIGN_STAMPS, payload });
    }
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
        campaignDescription: response_.campaignDesc,
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

function getPendingRewards(payload, type) {
  return async () => {
    let response = await CRMService.api(
      'GET',
      payload,
      `customer/pending-rewards/${type}`,
      'bearer'
    );

    return response;
  };
}

function setData(data, constant) {
  return {
    type: constant,
    data: data?.Data,
  };
}

export const CampaignAction = {
  getCampaignPoints,
  getCampaignStamps,
  getCampaignByPoints,
  getPendingRewards,
};
