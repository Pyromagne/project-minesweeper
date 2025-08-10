function timestampToMilliseconds(t: string): number {
    const [hh, mm, ssMs] = t.split(':');
    const [ss, ms] = ssMs.split('.');
    return (
        Number(hh) * 3600000 +
        Number(mm) * 60000 +
        Number(ss) * 1000 +
        Number(ms)
    );
}

export default timestampToMilliseconds;