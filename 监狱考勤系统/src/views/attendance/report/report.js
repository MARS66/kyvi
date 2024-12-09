const code_status = [
    {
        code: 0,
        status: "无记录"
    }
]

export function code2status(code) {
    code_status.forEach(element => {
        if (element.code == code) { return element.status }
    });
}