const supportedUnit = ["B", "KB", "MB"];
export const fileSizeFromTo = (fileSize, fromUnit, toUnit) => {
    /*
    1. check fromUnit and toUnit supported
    2. convert fileSize from fromUnit to B
    3. convert fileSize from B to toUnit
    */
    if (!supportedUnit.includes(fromUnit) || !supportedUnit.includes(toUnit)) {
        throw new Error(`${fromUnit} or ${toUnit} is not supported`);
    }
    const fromUnitIndex = supportedUnit.indexOf(fromUnit);
    const toUnitIndex = supportedUnit.indexOf(toUnit);
    const fromUnitToB = Math.pow(1024, fromUnitIndex);
    const toUnitToB = Math.pow(1024, toUnitIndex);
    const fileSizeInB = fileSize * fromUnitToB;
    const fileSizeInNewUnit = fileSizeInB / toUnitToB;
    return fileSizeInNewUnit;
}
