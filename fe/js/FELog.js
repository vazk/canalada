

FE.LOG = { I:0, W:1, E:2, U:3 }; 

FE.logPrefix = function(logType) {
    var pre = "";
    if(logType == FE.LOG.I) {
        pre = 'Info: ';
    } else
    if(logType == FE.LOG.W) {
        pre = 'Warning: ';
    } else
    if(logType == FE.LOG.E) {
        pre = 'Error: ';
    } else {
        pre = 'Unknown: ';
    }
    return pre;
}

FE.logMessage = function(logType, message, date) {
    document.getElementById("system-log-pane").innerHTML += 
        '<log><b>[' + date + ']' + FE.logPrefix(logType) + '</b>' + message + '</log><br>';
}