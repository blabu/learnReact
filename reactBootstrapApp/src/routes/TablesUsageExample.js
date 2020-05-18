import React from 'react'
import 'bootstrap/dist/css/bootstrap.css'
import '../index.css'
import {TableShort as Table} from '../utilities/Table'
import {TableLong as TableList} from '../utilities/Table'

export default function TablesUsageExample() {
    return (
        <div className="card centered">
            <h5>You are at home now</h5>
            {Table({
                head: ["1","2","3","4","5"], 
                list: [
                    [()=>"108",()=>"109",()=>"110",()=>"111",()=>{return <button className="btn btn-primary">OK</button>}],
                    [()=>"208",()=>"209",()=>"210",()=>"211",()=>{return <button className="btn btn-primary">OK</button>}],

                    [()=>"108",()=>"109",()=>"110",()=>"111",()=>{return <button className="btn btn-primary">OK</button>}],
                    [()=>"208",()=>"209",()=>"210",()=>"211",()=>{return <button className="btn btn-primary">OK</button>}],

                    [()=>"108",()=>"109",()=>"110",()=>"111",()=>{return <button className="btn btn-primary">OK</button>}],
                    [()=>"208",()=>"209",()=>"210",()=>"211",()=>{return <button className="btn btn-primary">OK</button>}],
                ]
            })}

            {TableList({
                head: ["1","2","3","4","5","6","7","8","9","10","11","12"], 
                list: [
                    [()=>"101",()=>"102",()=>"103",()=>"104",()=>"105",()=>"106",()=>"107",()=>"108",
                    ()=>"109",()=>"110",()=>"111",()=>{return <button className="btn btn-primary">OK</button>}],
                    [()=>"201",()=>"202",()=>"203",()=>"204",()=>"205",()=>"206",()=>"207",()=>"208",
                    ()=>"209",()=>"210",()=>"211",()=>{return <button className="btn btn-primary">OK</button>}],

                    [()=>"101",()=>"102",()=>"103",()=>"104",()=>"105",()=>"106",()=>"107",()=>"108",
                    ()=>"109",()=>"110",()=>"111",()=>{return <button className="btn btn-primary">OK</button>}],
                    [()=>"201",()=>"202",()=>"203",()=>"204",()=>"205",()=>"206",()=>"207",()=>"208",
                    ()=>"209",()=>"210",()=>"211",()=>{return <button className="btn btn-primary">OK</button>}],

                    [()=>"101",()=>"102",()=>"103",()=>"104",()=>"105",()=>"106",()=>"107",()=>"108",
                    ()=>"109",()=>"110",()=>"111",()=>{return <button className="btn btn-primary">OK</button>}],
                    [()=>"201",()=>"202",()=>"203",()=>"204",()=>"205",()=>"206",()=>"207",()=>"208",
                    ()=>"209",()=>"210",()=>"211",()=>{return <button className="btn btn-primary">OK</button>}],
                ]
            })}
        </div>
    );
}
