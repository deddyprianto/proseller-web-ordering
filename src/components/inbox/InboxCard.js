import React, { Component } from 'react';
import EmailIcon from '@material-ui/icons/Email';
import DraftsIcon from '@material-ui/icons/Drafts';
import moment from 'moment';

export default class InboxCard extends Component {
  render() {
    const { items } = this.props
    return (
      <div style={{
        boxShadow: "0px 0px 5px rgba(128, 128, 128, 0.5)", border: "1px solid #CDCDCD",
        padding: 10, cursor: "pointer", display: "flex",
        flexDirection: "row", margin: 5, borderRadius: 5
      }}>
        {
          !items.isRead ?
            <EmailIcon className="customer-group-name" style={{
              height: 50, width: 50,
              marginRight: 10,
            }} /> :
            <DraftsIcon style={{
              height: 50, width: 50,
              marginRight: 10, color: 'gray'
            }} />
        }

        <div style={{ display: "flex", flexDirection: "column", justifyContent: "center", width: "100%", textAlign: "left" }}>
          <div style={{
            display: "flex", flexDirection: "row",
            justifyContent: "space-between"
          }}>
            <div className={!items.isRead ? "customer-group-name" : ""}
              style={{ fontWeight: "bold", fontSize: 14, color: (!items.isRead ? "" : "gray") }}>
              {items.name.length > 20 ? items.name.substring(0, 20).concat("...") : items.name}
            </div>
            <div style={{ color: "gray", fontSize: 10, fontStyle: 'italic', }}>{moment(items.createdOn).format('DD/MM/YY HH:mm')}</div>
          </div>
          <div style={{ fontSize: 12, color: "gray" }}>{items.message.substring(0, 35).concat("...")}</div>
        </div>
      </div>
    );
  }
}
