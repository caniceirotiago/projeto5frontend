import React, { useEffect, useState }from "react"
import {statisticsService} from "../../../../services/statisticsService"

const UserProfileStatistics = ({tasks}) => {
    if(tasks === undefined){
        return(
            <>
            Loading...
            </>
        )
    }

    return(
        <>
        Todo: {tasks.todoTasks}<br></br>
        Doing: {tasks.doingTasks}<br></br>
        Done:{tasks.doneTasks}
        </>
    )
    

}
export default UserProfileStatistics