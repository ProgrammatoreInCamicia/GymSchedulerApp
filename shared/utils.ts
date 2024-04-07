import { SetConfig } from "../store/store.models";

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

export function getGroupedSetsConfig(setsConfig: SetConfig[]) {
    const groupedData = setsConfig.reduce((acc, cur) => {
        const { guid, reps, weight } = cur;
        const existingItem = acc.find(item =>
            item.guid === guid && item.reps == reps && item.weight == weight
        );

        if (existingItem) {
            existingItem.sets += 1;
        } else {
            acc.push({ guid, reps: reps.toString(), weight: weight.toString(), sets: 1 });
        }

        return acc;
    }, []);

    return groupedData;
}