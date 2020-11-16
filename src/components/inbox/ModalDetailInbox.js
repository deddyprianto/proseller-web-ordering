import React, { Component } from 'react';
import moment from 'moment';

export default class ModalDetailInbox extends Component {
  linkDetection = (text) => {
    if(text){
      try {
        let urlRegex = /(https?:\/\/[^\s]+)/g;
        text = text.replace(urlRegex, '<a href="$1" target="_blank">$1</a>')
        return <p dangerouslySetInnerHTML={{__html: text}} />
      } catch (error) { }
    }
    return text
  }
  
  render() {
    const { data } = this.props
    return (
      <div>
        <div className="modal fade" id="detail-inbox-modal" tabIndex={-1} role="dialog" aria-labelledby="exampleModalCenterTitle" aria-hidden="true">
          <div className="modal-dialog modal-dialog-centered" role="document">
            <div className="modal-content" style={{ width: "100%", marginTop: 100, marginBottom: 100 }}>
              <div className="modal-header" style={{ display: "flex", justifyContent: "left" }}>
                <h5 className="modal-title" id="exampleModalLabel" style={{ fontSize: 16 }}>{data.name}</h5>
                <button type="button" className="close" data-dismiss="modal" aria-label="Close" style={{
                  position: "absolute", right: 10, top: 13
                }}>
                  <span aria-hidden="true" style={{ fontSize: 30 }}>×</span>
                </button>
              </div>
              <div className="modal-body">

                <div style={{
                  border: "1px solid #CDCDCD", borderRadius: 5, paddingLeft: 10,
                  paddingRight: 10, paddingTop: 5
                }}>
                  <div style={{ fontSize: 14, lineHeight: "20px" }}>
                    {this.linkDetection(data.message)}
                    {/* {`Test <a href="http://auntieannesg.com/" target="_blank">http://auntieannesg.com/</a> test test 123123`} */}
                  </div>
                  <div style={{ marginTop: 10, fontSize: 10, fontStyle: 'italic', textAlign: "right" }}>
                    {moment(data.createdOn).format('DD/MM/YY HH:mm')}
                  </div>
                </div>

              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
