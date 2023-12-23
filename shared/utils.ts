export function formatDate(d: Date, mode: 'date' | 'time' = 'date') {
    d = new Date(d);
    if (mode == 'date') {
        var month = '' + (d.getMonth() + 1),
            day = '' + d.getDate(),
            year = d.getFullYear();

        if (month.length < 2)
            month = '0' + month;
        if (day.length < 2)
            day = '0' + day;

        return [day, month, year].join('/');
    } else {
        var hour = '' + d.getHours(),
            minutes = '' + d.getMinutes();

        return [hour, minutes].join(':');
    }
}