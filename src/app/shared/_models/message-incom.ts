
export class MessageIncom {
    success: boolean;
    message: string;
    data: data;
}

interface data {
    total: number;
    data: arrayData;
}

interface arrayData {
    id: number;
    phonenumber: string;
    routerule: string;
    templatecode: string;
    list_param: string;
    supplier: string;
    timesend: string;
    timeadd: string;
    complete: string;
    hits: string;
    id_omni: string;
    channel: string;
}
