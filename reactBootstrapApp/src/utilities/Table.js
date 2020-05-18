import React from 'react'
import PropTypes from 'prop-types'
import 'bootstrap/dist/css/bootstrap.css'

function TableShort({head, list}) {
    return (
        <div className="container container-fluid">
            <div className="row bg-info border-bottom d-none d-md-flex">
                {head.map((t,i)=><div className="col" key={i}>{t}</div>)}
            </div>
            {list.map((row, i) => {
                return (<div className="row border-bottom" key={i}>
                            {row.map((cell, j) => <div className="col-md" key={(i+1)*(j+1)}>{cell()}</div>)}
                        </div>);
            })}
        </div>
    )
}

function TableLong({head, list}) {
    return (
        <div className="table-responsive-md">
        <table className="table table-striped">
            <thead>
                <tr className="bg-info">
                    {head.map((t,i)=><th key={i}>{t}</th>)}
                </tr>
            </thead>
            <tbody>
                {list.map((row, i) => {
                    return (<tr key={i}>
                                {row.map((cell, j) => <td key={(i+1)*(j+1)}>{cell()}</td>)}
                            </tr>);
                })}
            </tbody>
        </table>
        </div>
    )
}

/**
 * Input parameters is 
 * {
 *  head : []string,
 *  list : [][]function() return jsx (react render element)
 *                  
 * }
 * 
 */
TableLong.prototype = {
    head: PropTypes.arrayOf(PropTypes.string).isRequired,  // Шапка таблицы фиксируется
    list: PropTypes.arrayOf(
            PropTypes.arrayOf(PropTypes.func.isRequired)
    ).isRequired
}

TableShort.prototype = {
    head: PropTypes.arrayOf(PropTypes.string).isRequired,  // Шапка таблицы фиксируется
    list: PropTypes.arrayOf(
            PropTypes.arrayOf(PropTypes.func.isRequired)
    ).isRequired
}

export {TableShort, TableLong};