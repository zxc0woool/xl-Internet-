﻿import $ from 'jquery';
import './index.css'

let Calendar = function (element, options) {

    this.el = $(element);
    this.options = $.extend(true, {}, this.options, options);
    this.init();
}
Calendar.prototype = {

    options: {
        mode: "month",
        weekMode: ["一", "二", "三", "四", "五", "六", "日"],
        newDate: new Date(),
        width: null,
        height: null,
        shwoLunar: false,
        showModeBtn: true,
        showEvent: true,
        maxEvent: null
    },

    init: function () {
        let me = this,
            el = me.el,
            opts = me.options;

        el.addClass("calendar");
        opts.width = el.width();
        opts.height = el.height();

        if (typeof (opts.newDate) == "string") {
            opts.newDate = me._getDateByString(opts.newDate)
        }

        me._createCalendar();

        //绑定事件
        //changeMode
        el.on("click", ".calendar-mode-select .btn", function (e) {
            e.stopPropagation();
            let modeText = $(this).text();
            let mode = modeText == "月" ? "month" : "year";
            me.changeMode(mode);
        })
        //calendar-cell日期点击事件
        el.on("click", ".calendar-cell", function (e) {
            e.stopPropagation();
            $(".dropdown-month").removeClass("open");
            $(".dropdown-year").removeClass("open");

            let cellDate = $(this).attr("title");

            let viewData = me.viewData;
            let year = parseInt(cellDate.split("年")[0]);
            let month = parseInt(cellDate.split("年")[1].split("月")[0]) - 1;
            let date = parseInt(cellDate.split("年")[1].split("月")[1].split("日")[0]);

            if (opts.mode == "year") {
                if (opts.cellClick) opts.cellClick.call(me, viewData[month])
            }
            else if (opts.mode == "month" && month == opts.newDate.getMonth()) {

                if (opts.cellClick) opts.cellClick.call(me, viewData[date])
            }
        })

        //年份下拉
        el.on("click", ".calendar-year-select", function (e) {
            e.stopPropagation();
            $(".dropdown-month").removeClass("open");
            $(".dropdown-year").toggleClass("open");
            //创建下拉数据
            let yearText = opts.newDate.getFullYear();
            let s = '';
            for (let i = 0; i < 21; i++) {
                if (i == 10) {
                    s += '<li class="year-item active">'
                }
                else {
                    s += '<li class="year-item">'
                }
                s += '<span class="year-check">' + (yearText - 10 + i) + '</span>'
                s += '<span >年</span>'
                s += '</li>'
            }
            me.el.find(".dropdown-year").html(s);
        })
        //年份改变
        el.on("click", ".year-item", function (e) {
            e.stopPropagation();
            $(".dropdown-year").removeClass("open");

            let yearText = this.title;
            if (yearText === "") {
                yearText = $(this).text();
            }
            let yearNum = yearText.split("年")[0];
            if (yearNum == opts.newDate.getFullYear()) return;
            opts.newDate.setFullYear(yearNum);
            opts.mode == "month" ? me._refreshCalendar(opts.newDate) : me._refreshYearCalendar(opts.newDate);
            $(".calendar-year-text").text(yearText);
            me._createCalendar();
            if(opts.onTimeChange) opts.onTimeChange(opts.newDate);
        })

        //触发选择月份
        el.on("click", ".calendar-month-select", function (e) {
            e.stopPropagation();
            $(".dropdown-year").removeClass("open");
            $(".dropdown-month").toggleClass("open");
        })
        //月份check事件
        el.on("click", ".month-item", function (e) {
            e.stopPropagation();
            $(".dropdown-month").removeClass("open");
            // let monthText = $(this).text();
            let monthText = this.title;
            if (monthText === "") {
                monthText = $(this).text();
            }
            let monthNum = monthText.split("月")[0];
            if (monthNum == (opts.newDate.getMonth() + 1)) return;

            let beforeDate = opts.newDate.getDate();
            opts.newDate.setMonth(monthNum - 1);
            let afterDate = opts.newDate.getDate();

            //处理日期30号，切换到2月不存在30号
            if (beforeDate != afterDate) {
                opts.newDate.setDate(opts.newDate.getDate() - 1);
            }
            me._refreshCalendar(opts.newDate);
            $(".calendar-month-text").text(monthText);
            me._createCalendar();
            if(opts.onTimeChange) opts.onTimeChange(opts.newDate);
        })
        $(document.body).on("click", function (e) {
            $(".dropdown-month").removeClass("open");
            $(".dropdown-year").removeClass("open");
        })
    },
    //公开方法
    changeMode: function (mode) {
        let me = this;
        if (mode == me.options.mode) return;
        me.options.mode = mode;
        me._createCalendar();
    },


    getViewDate: function (viewDate) {
        let me = this,
            opts = me.options,
            mode = opts.mode,
            data = opts.data;
        if (!data || data.length == 0) return [];
        let viewData = {},
            modeYear = viewDate.getFullYear(),
            modeMonth = null;
        if (mode == "month") { modeMonth = viewDate.getMonth() };

        //筛选视图数据并转化未对象 要不要转化为属性
        for (let i = 0; i < data.length; i++) {
            let item = data[i];

            let start = me._getDateByString(item.startDate);

            let year = start.getFullYear();
            let month = start.getMonth();
            let date = start.getDate();
            if (modeMonth && year == modeYear && modeMonth == month) {
                if (!viewData[date]) viewData[date] = [];
                viewData[date].push(item);
            }
            else if (!modeMonth && year == modeYear) {
                // if (!viewData[month]) viewData[month] = [];
                // viewData[month].push(item);
                if (!viewData[date]) viewData[date] = [];
                viewData[date].push(item);

            }

        }

        return viewData;

    },
    _getDateByString: function (stringDate) {

        let year = stringDate.split("-")[0];
        let month = parseInt(stringDate.split("-")[1]) - 1;
        let date = stringDate.split("-")[2];

        return new Date(year, month, date);
    },
    //私有方法
    _createCalendar: function (_d) {
        if(_d){
            this.options['data'] = _d['data'];
            this.options['newDate'] = new Date(_d['newDate']);
        }

        let me = this;
        let dateMode = me.options.mode;



        me._createView()
        // if(dateMode == "year"){
        //     me._createYearView();
        // }else{
        //     me._createMonthView();
        // }


    },
    _createView: function () {
        let me = this,
            el = me.el,
            opts = me.options,
            mode = opts.mode,
            newDate = opts.newDate,
            html = '';
        html += me._createToolbar();
        html += '<div class="calendar-body">';
        html += '<table class="calendar-table" cellspacing="0">'
        if (mode == "month") {
            html += me._createHeader();
        }
        html += me._createBody();
        html += '</table>'
        html += '</div>'
        el.html(html);


        if (mode == "month") {
            me._refreshCalendar(newDate);
        }
        else {
            me._refreshYearCalendar(newDate);
        }

    },
    _createToolbar: function () {
        let me = this,
            newDare = me.options.newDate,
            mode = me.options.mode,
            showModeBtn = me.options.showModeBtn,
            s = '';

        let year = newDare.getFullYear();
        let month = newDare.getMonth() + 1;

        s += '<div class="calendar-header">'
        s += '<span title="' + (year - 1) + '年" class="calendar-select year-item" ><<</span>'
        s += '<div class="calendar-select calendar-year-select" >'
        s += '<span class="calendar-year-text"> ' + year + '年</span >'
        s += '<span class="calendar-icon"><i class="fa fa-angle-down"></i></span>'
        s += '<ul id="dropdown-year" class="dropdown-year">'
        s += '</ul>'
        s += '</div > '
        s += '<span title="' + (year + 1) + '年" class="calendar-select year-item" >>></span>'

        if (mode == "month") {
            s += '<span title="' + (month - 1) + '月" class="calendar-select month-item" ><<</span>'
            s += '<div class="calendar-select  calendar-month-select">'
            s += '<span class="calendar-month-text"> ' + month + '月</span >'
            s += '<span class="calendar-icon"><i class="fa fa-angle-down"></i></span>'

            //创建月份下拉(写死)
            s += '<ul class="dropdown-month">'
            for (let i = 1; i <= 12; i++) {
                s += '<li class="month-item">'
                s += '<span class="month-check">' + i + '</span>'
                s += '<span >月</span>'
                s += '</li>'
            }
            s += '</ul>'
            s += '</div > '
            s += '<span title="' + (month + 1) + '月" class="calendar-select month-item" >>></span>'
        }

        if (showModeBtn) {
            s += '<div class="calendar-select  calendar-mode-select">'
            s += '<div class="btn-group">'

            if (mode == "month") {
                s += '<span  class="btn calendar-select-active">月</span>'
                s += '<span class="btn">年</span>'
            }
            else {
                s += '<span  class="btn">月</span>'
                s += '<span class="btn calendar-select-active">年</span>'
            }
            s += '</div>'
            s += '</div>'
        }

        s += '</div >'
        return s;
    },
    _createHeader: function () {
        let me = this,
            opts = me.options,
            weekMode = opts.weekMode;
        let s = '<thead><tr>'
        weekMode.forEach(function (item) {
            s += ' <th class="calendar-column-header" title="周' + item + '">'
            if (item === "六" || item === "日") {
                s += '<span class="calendar-column-header-inner required">' + item + '</span>'
            } else {
                s += '<span class="calendar-column-header-inner">' + item + '</span>'
            }

            s += '</th>'
        })
        s += '</thead></tr>'
        return s;
    },
    _createBody: function () {
        let me = this;
        let s = ' <tbody class="calendar-tbody">'
        s += '</tbody>'
        return s;
    },
    _refreshYearCalendar: function (newDate) {
        let me = this,
            viewData = {},
            showEvent = me.options.showEvent,
            maxEvent = me.options.maxEvent,
            s = '';

        //每次都重新获取会不会影响性能
        me.viewData = viewData = me.getViewDate(newDate);

        let year = newDate.getFullYear(), month = newDate.getMonth();
        //四行三列
        for (let i = 0; i < 4; i++) {
            s += '<tr>'
            for (let l = 0; l < 3; l++) {
                let renderMonth = i * 3 + l;
                if (month == renderMonth) {
                    s += '<td title="' + year + '年' + (renderMonth + 1) + '月" class="calendar-cell calendar-thisMonth">';
                }
                else {
                    s += '<td title="' + year + '年' + (renderMonth + 1) + '月" class="calendar-cell">';
                }
                s += '<div class="calendar-date">';
                s += '<div class="calendar-value">' + (renderMonth + 1) + '月</div>';
                s += '<div class="calendar-content"><ul class="events">'

                if (showEvent && viewData[renderMonth]) {
                    if (maxEvent && viewData[renderMonth].length > maxEvent) {
                        s += viewData[renderMonth].length + "个事件";
                    }
                    else {
                        viewData[renderMonth].forEach(function (item) {
                            if(item.color){
                                let color = JSON.parse(item.color);
                                s += '<li style="background-color:'+ `rgba(${color.r}, ${color.g}, ${color.b}, ${color.a})` +'"><span>' + item.name + '</span></li>'
                            }else{

                            }
                           
                        })
                    }
                }
                s += '</ul ></div > ';
                s += '</div></td>';
            }
            s += '</tr>'
        }

        me.el.find(".calendar-tbody").html(s);
    },
    _refreshCalendar: function (newDate) {
        let me = this,
            viewData = {},
            showEvent = me.options.showEvent,
            maxEvent = me.options.maxEvent,
            s = '';

        me.viewData = viewData = me.getViewDate(newDate);

        let _newDate = me._cloneDate(newDate);
        //当前date
        let nowNum = _newDate.getDate();

        //第一天周几
        _newDate.setDate(1);
        let weekDay = _newDate.getDay() == 0 ? 7 : _newDate.getDay();


        //视图第一天
        let viewDate = me._cloneDate(_newDate);
        viewDate.setDate(viewDate.getDate() - weekDay + 1);

        //当前第几周/行 (暂不处理)
        let spileDate = (newDate.getTime() - viewDate.getTime()) / (1000 * 60 * 60 * 24);

        let renderDate = me._cloneDate(viewDate);


        //固定六行
        for (let i = 0; i < 6; i++) {
            s += '<tr>'
            for (let l = 0; l < 7; l++) {

                let year = renderDate.getFullYear();
                let month = renderDate.getMonth() + 1;
                let date = renderDate.getDate();

                let names = "";

                if (showEvent && viewData[date] && renderDate.getMonth() == newDate.getMonth()) {
                    viewData[date].forEach(function (item) {
                        if(item.status === "上班"){
                            names += item.name + ':[' + item.date + ']' + '\n' 
                        }
                        
                    })
                }
                let data = year + '年' + month + '月' + date + '日' + '\n' + names

                if (renderDate.getMonth() < newDate.getMonth()) {
                    s += '<td title="' + data + '" class="calendar-cell calendar-last-month-cell">';
                }
                else if (renderDate.getMonth() > newDate.getMonth()) {
                    s += '<td title="' + data + '" class="calendar-cell calendar-next-month-cell">';
                }
                else if (date == nowNum) {
                    s += '<td title="' + data + '" class="calendar-cell calendar-today">';
                }
                else {
                    s += '<td title="' + data + '" class="calendar-cell">';
                }
                s += '<div class="calendar-date">';
                s += '<div class="calendar-value">' + date + '</div>';
                s += '<div class="calendar-content"><ul class="events">'
                if (showEvent && viewData[date] && renderDate.getMonth() == newDate.getMonth()) {
                    if (maxEvent && viewData[date].length > maxEvent) {
                        s += viewData[date].length + "个事件";
                    }
                    else {
                        viewData[date].forEach(function (item) {
                            if(item.color){
                                let color = JSON.parse(item.color);
                                if(item.status === "上班"){
                                    s += '<li style="background-color:'+ `rgba(${color.r}, ${color.g}, ${color.b}, ${color.a})` +'"><span>' + item.name + '</span></li>'
                                }
                            }else{
                                
                            }
                           
                        })
                    }
                }
                s += '</ul ></div > ';
                s += '</div></td>';

                renderDate.setDate(renderDate.getDate() + 1);

            }
            s += '</tr>'
        }
        me.el.find(".calendar-tbody").html(s);
    },
    _cloneDate: function (date) {
        return new Date(date.getFullYear(), date.getMonth(), date.getDate());
    },

}
$.fn.calendar = function (options) {

    let isSTR = typeof options == "string",
        args, ret;

    if (isSTR) {
        args = $.makeArray(arguments)
        args.splice(0, 1);
    }

    let name = "calendar",
        type = Calendar;

    let jq = this.each(function () {
        let ui = $.data(this, name);

        if (!ui) {
            ui = new type(this, options);
            $.data(this, name, ui);
        }else{
            ui._createCalendar(options);
        }
        if (isSTR) {
            ret = ui[options].apply(ui, args);
        }
    });

    return isSTR ? ret : jq;
};

export default $;