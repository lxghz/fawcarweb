var CommonUtil = {
    /**
     * 从URL查询串获取JSON键值对
     *
     * @returns {String}
     */
    getJsonFromUrl : function() {
        var obj = {};
        location.search.replace(/[\?&]([^=#]+)=([^&#]*)/g,
            function($1, $2, $3) {
                obj[$2] = obj[$2] ? obj[$2] + "," + $3 : decodeURI($3);
            });
        return obj;
    },
    /**
     * ajax Request
     *
     * @param {type}
     *            url
     * @param {type}
     *            data
     * @returns {jqXHR}
     */
    doAjaxRequest : function(url, data) {
        var ajaxRequest = $.ajax({
            type : "POST",
            url : url,
            async : true,
            contentType : "application/json; charset=utf-8",
            dataType : "json",
            data : data,
            success : function(result) {
                $.messager.show({
                    title : '操作信息',
                    msg : '删除成功'
                });
            },
            error : function(result) {
                var errorMsg;
                if (typeof console != "undefined")
                    console.log(result);
                if (result.readyState == undefined) {
                    errorMsg = "网络异常";
                } else {
                    errorMsg = result.responseText;
                }
                $.messager.show({
                    title : '错误信息',
                    msg : errorMsg
                });
            }
        });
        return ajaxRequest;
    },

    /**
     * ajax Request
     *
     * @param {type}
     *            url
     * @param {type}
     *            data
     * @returns {jqXHR}
     */
    doAjaxWithoutSuccessInfoRequest : function(url, data) {
        var ajaxRequest = $.ajax({
            type : "POST",
            url : url,
            async : true,
            contentType : "application/json; charset=utf-8",
            dataType : "json",
            data : data,
            success : function(result) {
            },
            error : function(result) {
                var errorMsg;
                if (typeof console != "undefined")
                    console.log(result);
                if (result.readyState != undefined) {
                    errorMsg = "网络异常";
                } else {
                    errorMsg = result.responseText;
                }
                $.messager.show({
                    title : '错误信息',
                    msg : errorMsg
                });
            }
        });
        return ajaxRequest;
    }
}