const emailRegex = /\w+([-+."]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*/;
export default (value: string) => emailRegex.test(value);
