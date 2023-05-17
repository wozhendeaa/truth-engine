import error from 'assets/img/others/error.png';


export const parseErrorMsg = (e: any) => {
    return JSON.parse(e.message)[0]["message"];
}
