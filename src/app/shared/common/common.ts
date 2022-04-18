import * as moment from 'moment';

//Suggestion number quantity
export const suggestionNumberQuantity = (value)=>{
    try {
        let arrData = JSON.parse(localStorage.getItem('rememberQuantitySuggestion'));
        let arrNumber = [];
        let number = 1;
        if(value){
            number = parseInt(value);
            if(!number){
                number = 1;
            }
            arrNumber = [number * 100, number * 1000, number * 10000, number * 100000];
        }else{
            let isArr = false;
            if(arrData){
                if(arrData.length > 0){
                    isArr = true;
                }
            }
            if(isArr){
                arrNumber = arrData;
            }else{
                arrNumber = [number * 100, number * 1000, number * 10000, number * 100000];
            }
        }
        return arrNumber;
    } catch (error) {
        
    }
}

export const convertTextDecimal = (number)=>{
    if(typeof number === 'number'){
        number = number.toFixed(0);
        return parseInt(number).toLocaleString(undefined, {maximumFractionDigits:2});
    }
    return number;
}

export const convertDDMMYYYYHHMM = (date) => {
    return moment(new Date(date)).format('DD/MM/YYYY HH:mm');
}

//check time type
export const compareTimeTradeType = (value, masterRelative)=>{
    try {
        let timeCurrent = new Date().getTime(); //Time hiện tại
        let timeValidPM1430 = new Date().setHours(14,30,0,0); //Thời gian 14h30
        let timeValidPM1445 = new Date().setHours(14,45,0,0); //Thời gian 14h45
        let timeValidAM0900 = new Date().setHours(9,0,0,0); //Thời gian 9h00
        let timeValidAM09015 = new Date().setHours(9,15,0,0); //Thời gian 9h15
        if(value === 0 && masterRelative > 0){
            if(timeCurrent > timeValidAM0900 && timeCurrent < timeValidAM09015)
                return 'ATO'; //mua (màu trần), bán (màu sàn)
            if(timeCurrent > timeValidPM1430 && timeCurrent < timeValidPM1445)
                return 'ATC'; //mua (màu trần), bán (màu sàn)
        }
        return value ? convertTextDecimal(value) : 0;
    } catch (error) {
        
    }
    
}


//convert string to time
export const stringToTimeHHMMSS = (time)=>{
    try {
        return moment(time, 'HH:mm:ss').add(7, 'hours').format("hh:mm:ss"); //convert fomat time zone, after add 7h
    } catch (error) {
        
    }
}


//convert date to format yyyyMMdd
export const dateToYYYYMMDD = (fromDate)=>{
    try {
        let d = new Date(fromDate),
            month = '' + (d.getMonth() + 1),
            day = '' + d.getDate(),
            year = d.getFullYear();

        if (month.length < 2) 
            month = '0' + month;
        if (day.length < 2) 
            day = '0' + day;

        return [year, month, day].join('');
    } catch (error) {
        
    }
}