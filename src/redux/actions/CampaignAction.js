import { CONSTANT } from "../../helpers";
import { CRMService } from "../../Services/CRMService";
import { AuthActions } from "./AuthAction";
import _ from 'lodash';

export const CampaignAction = {
  getCampaignPoints,
  getCampaignStamps,
  getCampaignByPoints,
};

function getCampaignStamps(payload = null) {
  return async (dispatch) => {
    let response = await CRMService.api('GET', payload, 'customer/stamps', 'bearer')
    if (response.ResultCode === 400) await dispatch(AuthActions.refreshToken())
    else {
      if (response.Data && response.Data.stamps && response.Data.stamps.stampsItem) {
        let dataStamps = [], isi = [], stampsTrueItem, stampsDetail;
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
          maxStampsPerDay: response.Data.stamps.maxStampsPerDay
        }
        stampsTrueItem = _.filter(response.Data.stamps.stampsItem, _.iteratee(['stampsStatus', true]));

        let dataStampsRasio = `${stampsTrueItem.length}":"${response.Data.stamps.stampsItem.length}`
        let campaignStampsAnnouncement = false

        if (response.Data.trigger && response.Data.trigger.campaignTrigger === "COMPLETE_PROFILE" && !response.Data.trigger.status) {
          campaignStampsAnnouncement = true
        }

        if (dataStamps && dataStampsRasio && dataStamps.length > 0 && dataStamps[0][dataStampsRasio.split(":")[0]] && dataStamps[0][dataStampsRasio.split(":")[0]].reward) {
          let image = dataStamps[0][dataStampsRasio.split(":")[0]].reward.imageURL;
          this.setState({ image });
        }

        response.Data = { dataStampsRasio, dataStamps, campaignStampsAnnouncement, stampsDetail }
      }
    }
    dispatch(setData(response, CONSTANT.KEY_GET_CAMPAIGN_STAMPS))
    return response
  };
}

function getCampaignPoints(payload = null, companyId = null) {
  return async (dispatch) => {
    let response = await CRMService.api('GET', null, 'customer/point', 'bearer')
    if (response.ResultCode === 400) await dispatch(AuthActions.refreshToken())
    else {
      let totalPoint = response.Data.campaignActive ? response.Data.totalPoint : 0
      let campaignPointActive = response.Data.campaignActive
      let pointsToRebateRatio = response.Data.pointsToRebateRatio || "0:0"
      let campaignPointAnnouncement = false

      let response_ = await dispatch(getCampaignByPoints({ companyId }));
      let netSpendToPoint = "0:0"
      let roundingOptions = "INTEGER"
      if (response_.ResultCode === 200 && response_.Data.length > 0) {
        response_ = response_.Data[0]
        roundingOptions = response_.points.roundingOptions
        netSpendToPoint = response_.points.netSpendToPoint0 === undefined ? "0:0" : `${response_.points.netSpendToPoint0}:${response_.points.netSpendToPoint1}`
      }

      let detailPoint = {
        point: totalPoint,
        detail: response.Data.history,
        netSpendToPoint,
        roundingOptions
      }

      if (response.Data.trigger && response.Data.trigger.campaignTrigger === "COMPLETE_PROFILE" && !response.Data.trigger.status) {
        campaignPointAnnouncement = true
      }

      response.Data = { totalPoint, campaignPointActive, campaignPointAnnouncement, detailPoint, pointsToRebateRatio }
    }
    dispatch(setData(response, CONSTANT.KEY_GET_CAMPAIGN_POINTS))
    return response
  };
}

function getCampaignByPoints(payload = null) {
  return async (dispatch) => {
    let response = await CRMService.api('GET', payload, 'campaign/points', 'bearer')
    if (response.ResultCode === 400) await dispatch(AuthActions.refreshToken())
    dispatch(setData(response, CONSTANT.KEY_GET_CAMPAIGN_BY_POINTS))
    return response
  };
}

function setData(data, constant) {
  return {
    type: constant,
    data: data.Data,
  };
}