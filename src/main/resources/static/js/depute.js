/* form 序列化字段转json函数 */
$.fn.serializeObject = function() {
    var o = {};
    var a = this.serializeArray();
    $.each(a, function() {
        if (o[this.name] !== undefined) {
            if (!o[this.name].push) {
                o[this.name] = [ o[this.name] ];
            }
            o[this.name].push(this.value || '');
        } else {
            o[this.name] = this.value || '';
        }
    });
    return o;
};

var listurl="http://localhost:8080/depute/getAllBill";
var listurl1="http://localhost:8080/depute/getLineById";
var removeurl="http://localhost:8080/depute/deleteById/";
var removelineurl="http://localhost:8080/depute/deleteLineById/";
var saveurl="http://localhost:8080/depute/saveMain";

$(function() {
    var deputedatagrid = $("#dg");
    var deputedatagrid_1 = $("#dg1");
    var oid = "";
    var crepairstatus = new Array();
    $.getJSON("crepairstatus.json",function(items){
        $.each(items, function(i,item) {
            crepairstatus[item.id]=item.text;
        });
    });
    $('#crepairstatus').combobox({
        url: 'crepairstatus.json',
        method:'get',
        valueField:'id',
        textField:'text'
    });
    deputedatagrid.datagrid({
        url : listurl,
        method : 'get',
        width : '100%',
        idField : 'id',
        nowrap : true,
        striped : true,
        collapsible : true,
        async: false,
        toolbar : "#toolbar",
        loadMsg : '数据装载中......',
        emptyMsg:'无数据',
        singleSelect : true,
        fitColumns : true,
        sortName : 'id',
        sortOrder : 'id',
        remoteSort : true,
        pagination : false,
        rownumbers : true,
        columns : [ [
            {title : 'ID',	field : 'id',	width : 100	},
            {title : '分销商代码',	field : 'ndealerid',	width : 200	},
            {title : '分支机构代码',	field : 'nbranchid',	width : 100	},
            {title : '委托单号',	field : 'cservicerequisitionno',	width : 100	},
            {title : '车辆档案ID',	field : 'nvehicleid',	width : 100	},
            {title : '状态',	field : 'crepairstatus',	width : 100,formatter: function (value) {return crepairstatus[value];}},
            {title : '故障描述',	field : 'cmalfunctiondescription',	width : 100	}
        ] ],
        onSelect:function(index,data) {
            oid = data.id;
            deputedatagrid_1.datagrid({
                url : listurl1 + "/" + oid,
                method : 'get',
                width : '100%',
                idField : 'id',
                nowrap : true,
                async: false,
                striped : true,
                collapsible : true,
                toolbar : "#toolbar1",
                loadMsg : '数据装载中......',
                emptyMsg:'无数据',
                singleSelect : true,
                fitColumns : true,
                sortName : 'id',
                sortOrder : 'id',
                remoteSort : false,
                pagination : false,
                rownumbers : true,
                columns : [ [
                    {title : 'ID',	field : 'id',	width : 100	},
                    {title : '主记录ID',	field : 'nmainid',	width : 200	},
                    {title : '修理项目代码',	field : 'citemcode',	width : 100	},
                    {title : '修理项目名称',	field : 'citemname',	width : 150	}
                ] ]
            });
            deputedatagrid_1.datagrid('enableFilter');
        }

    });

    deputedatagrid_1.datagrid({
        url : listurl1 + "/" + oid,
        method : 'get',
        width : '100%',
        idField : 'id',
        nowrap : true,
        striped : true,
        collapsible : true,
        toolbar : "#toolbar1",
        loadMsg : '数据装载中......',
        emptyMsg:'无数据',
        singleSelect : true,
        async: false,
        fitColumns : true,
        sortName : 'id',
        sortOrder : 'id',
        remoteSort : false,
        pagination : false,
        rownumbers : true,
        columns : [ [
            {title : 'ID',	field : 'id',	width : 100	},
            {title : '主记录ID',	field : 'nmainid',	width : 200	},
            {title : '修理项目代码',	field : 'citemcode',	width : 100	},
            {title : '修理项目名称',	field : 'citemname',	width : 150	}
        ] ]
    });

    $("#dg").datagrid('enableFilter', [{
        field:'crepairstatus',
        type:'combobox',
        options:{
            panelHeight:'auto',
            data:[{value:'',text:'All'},{value:'0',text:'在修'},{value:'1',text:'结清'},{value:'2',text:'欠账'}],
            onChange:function(value){
                if (value == ''){
                    $("#dg").datagrid('removeFilterRule', 'crepairstatus');
                } else {
                    $("#dg").datagrid('addFilterRule', {
                        field: 'crepairstatus',
                        op: 'equal',
                        value: value
                    });
                }
                $("#dg").datagrid('doFilter');
            }
        }
    }]);

    $("#dg1").datagrid('enableFilter');
    $.ajaxSetup({
        cache : false
    });
})



function deleteMain() {
    var deputedatagrid = $("#dg");
    var deputedatagrid_1 = $("#dg1");
    var selected = deputedatagrid.datagrid('getSelected');
    if (selected) {
        $.messager.confirm('确认', '确认删除委托单?', function (r) {
            if (r) {
                var url = removeurl + selected.id;
                var data = selected.oid;
                var ajaxRequest = CommonUtil.doAjaxRequest(url, data);
                ajaxRequest.done(function (result) {
                    $("#dg").datagrid('reload');
                    $("#dg1").datagrid('reload');
                });

            }
        });

    } else {
        jQuery.messager.alert('提示:', '请选择要删除的行！', 'info');
    }
}

function deleteLine() {
    var deputedatagrid = $("#dg");
    var deputedatagrid_1 = $("#dg1");
    var selected = deputedatagrid.datagrid('getSelected');
    var selected_1 = deputedatagrid_1.datagrid('getSelected');
    if (selected_1) {
        $.messager.confirm('确认', '确认删除委托单明细?', function (r) {
            if (r) {
                var url = removelineurl + selected.id;
                var data = selected.oid;
                var ajaxRequest = CommonUtil.doAjaxRequest(url, data);
                ajaxRequest.done(function (result) {
                    $("#dg").datagrid('reload');
                    $("#dg1").datagrid('reload');
                });




            }
        });
    } else {
        jQuery.messager.alert('提示:', '请选择要删除的行！', 'info');
    }
}

function createMain() {
    $('#dlg').dialog('open').dialog('setTitle', '新建委托单');
    $('#fm').form('reset');
}

function saveCourse() {
    var deputedatagrid = $("#dg");
    var deputedatagrid_1 = $("#dg1");

    if($("#fm").form('validate')){
        var data = JSON.stringify($("#fm").serializeObject());
        $.ajax({
            type: "POST",
            url: saveurl,
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            data: data,
            success: function(result) {
                $("#dg").datagrid('reload');
                $("#dg1").datagrid('reload');
                $('#dlg').dialog('close');
                $.messager.show({
                    title : '操作信息',
                    msg : result.msg
                });
            },
            error:function(result) {
                $.messager.show({ // show error message
                    title : '错误信息',
                    msg : result.responseText
                });
            }
        });
    }
    $("#dg").datagrid("doFilter");
    $("#dg").datagrid('reload');
    $("#dg").datagrid("enableFilter");
    $("#dg1").datagrid('reload');
    $('#dlg').dialog('close');
}