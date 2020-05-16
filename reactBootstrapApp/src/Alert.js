import React from 'react'
import 'bootstrap/dist/css/bootstrap.css'
import './index.css'

export default function Alert({head, body}) {
    const [close, setClose] = React.useState(true)
    if(close) return (
        <div className="alert alert-danger">
            <button type="button" className="close" onClick={()=>setClose(false)}>
                <span>&times;</span>
            </button>
            <h4 className="alert-heading">{head}</h4>
            <hr/>
            {body}
        </div>
    )
    return null;
}

// export function Modal({head, body}) {
//     return (
//     <div className="modal fade">
//         <div className="modal-dialog">
//             <div className="modal-content">
//                 <div className="modal-header">
//                     <h5 className="modal-title">{head}</h5>
//                     <button type="button" className="close">
//                     <span>&times;</span>
//                     </button>
//                 </div>
//                 <div className="modal-body">
//                     {body}
//                 </div>
//                 <div className="modal-footer">
//                     <button type="button" className="btn btn-secondary">Close</button>
//                     <button type="button" className="btn btn-primary">OK</button>
//                 </div>
//             </div>
//         </div>
//     </div>);
// }