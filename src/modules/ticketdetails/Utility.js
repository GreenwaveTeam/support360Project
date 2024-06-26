import axios from "axios";

// export function createActivity(activityId, activityName, actvityBtnDisableOnCompletion, actvityBtnDisbleForActvtOrder, actvtCount, assetAvailable, assetAvlReasons, assetIDList, assetNameList, available, booleanForActivityStatus, buffer, completedActivity, disable, disableForAction, duration, enforce, groupOrDept, logbook, notBelongToApprover, notBelongToPerformer, pendingActivity, performerAvlReasons, rejectedActivity, sequence, taskId) {
//     return {
//         activityId: activityId || "",
//         activityName: activityName || "",
//         actvityBtnDisableOnCompletion: actvityBtnDisableOnCompletion || false,
//         actvityBtnDisbleForActvtOrder: actvityBtnDisbleForActvtOrder || false,
//         actvtCount: actvtCount || 0,
//         assetAvailable: assetAvailable || false,
//         assetAvlReasons: assetAvlReasons || [],
//         assetIDList: assetIDList || [],
//         assetNameList: assetNameList || [],
//         available: available || false,
//         booleanForActivityStatus: booleanForActivityStatus || false,
//         buffer: buffer || 0,
//         completedActivity: completedActivity || 0,
//         disable: disable || false,
//         disableForAction: disableForAction || false,
//         duration: duration || 0,
//         enforce: enforce || false,
//         groupOrDept: groupOrDept || false,
//         logbook: logbook || "",
//         notBelongToApprover: notBelongToApprover || false,
//         notBelongToPerformer: notBelongToPerformer || false,
//         pendingActivity: pendingActivity || 0,
//         performerAvlReasons: performerAvlReasons || [],
//         rejectedActivity: rejectedActivity || 0,
//         sequence: sequence || 0,
//         taskId: taskId || ""
//     };
// }


export function createActivity(taskId, taskName, jobId, activityId, activityName, sequence, logbook, duration, xPos, yPos, performer, approver, scheduledActivityStartTime, scheduledActivityEndTime, actualActivityStartTime, actualActivityEndTime, notBelongToPerformer, notBelongToApprover, actvityStatus, isActvityBtnDisableOnCompletion, isActvityBtnDisbleForActvtOrder, actAbrv, available, performerAvlReasons, assetAvailable, assetAvlReasons, actualActvtyStrt, actualActvtEnd, reviewerActivityStartTime, reviewerActivityStopTime, remarks, assetId, assetName, assetIDList, assetNameList, groupOrDept, groupOrDeptName, performerType, getGroupOrDeptWisePerformer, completedActivity, pendingActivity, rejectedActivity, date, actvtCount, actFile, buffer, delayDueToBuffer, enforce, selectedAssetList, selectedAssetIdsList,activityFileData) {
  return {
      taskId: taskId,
      taskName: taskName,
      jobId: jobId,
      activityId: activityId,
      activityName: activityName,
      sequence: sequence,
      logbook: logbook,
      duration: duration,
      xPos: xPos,
      yPos: yPos,
      performer: performer,
      approver: approver,
      scheduledActivityStartTime: scheduledActivityStartTime,
      scheduledActivityEndTime: scheduledActivityEndTime,
      actualActivityStartTime: actualActivityStartTime,
      actualActivityEndTime: actualActivityEndTime,
      notBelongToPerformer: notBelongToPerformer,
      notBelongToApprover: notBelongToApprover,
      // actvityStatus: actvityStatus,
      actvityStatus:'Not Started',
      isActvityBtnDisableOnCompletion: isActvityBtnDisableOnCompletion,
      isActvityBtnDisbleForActvtOrder: isActvityBtnDisbleForActvtOrder,
      actAbrv: actAbrv,
      available: available,
      performerAvlReasons: performerAvlReasons,
      assetAvailable: assetAvailable,
      assetAvlReasons: assetAvlReasons,
      actualActvtyStrt: actualActvtyStrt,
      actualActvtEnd: actualActvtEnd,
      reviewerActivityStartTime: reviewerActivityStartTime,
      reviewerActivityStopTime: reviewerActivityStopTime,
      remarks: remarks,
      assetId: assetId,
      assetName: assetName,
      assetIDList: assetIDList,
      assetNameList: assetNameList,
      groupOrDept: groupOrDept,
      groupOrDeptName: groupOrDeptName,
      performerType: performerType,
      getGroupOrDeptWisePerformer: getGroupOrDeptWisePerformer,
      completedActivity: completedActivity,
      pendingActivity: pendingActivity,
      rejectedActivity: rejectedActivity,
      date: date,
      actvtCount: actvtCount,
      actFile: actFile,
      buffer: buffer,
      delayDueToBuffer: delayDueToBuffer,
      enforce: enforce,
      selectedAssetList: selectedAssetList,
      selectedAssetIdsList: selectedAssetIdsList,
      activityFileData:activityFileData
  };
}


export function createJobDetails(
    task,
    //jobName,
    jobID,
    instrument,
    assigner,
    approver,
    scheduledJobStartTime,
    scheduledJobEndTime,
    actualJobStartTime,
    actualJobEndTime,
    priority,
    groupId,
    weekdays,jobStatus
  ) {
    return {
      task: task || null,
     // jobName:jobName||null, //This will be populated with the JobName
      jobID: jobID || null,
      instrument: instrument || null,
      assigner: assigner || null,
      approver: approver || null,
      scheduledJobStartTime: scheduledJobStartTime || null,
      scheduledJobEndTime: scheduledJobEndTime || null,
      actualJobStartTime: actualJobStartTime || null,
      actualJobEndTime: actualJobEndTime || null,
      priority: priority || null,
      groupId: groupId || null,
      weekdays: weekdays || null,//remember in the pojo itself the weekdays is set to 5
      jobStatus:'Not Started'//By default every new job create will have a default status of Not Started
    };
  }
 
 export function createTask(
    creationTime,
    taskName,
    taskId,
    status,
    reviewer,
    remarks,
    description,
    creator,
    hourMinutes,
    activityList
  ) {
    return {
      creationTime: creationTime || null,
      taskName: taskName || null,//This will be the taskname that will be selected by the user in Select Task
      taskId: taskId || null,
      status: status || null,
      reviewer: reviewer || null,
      remarks: remarks || null,
      description: description || null,
      creator: creator || null,
      hourMinutes: hourMinutes || null,
      activityList: activityList || [],
    };
  }
