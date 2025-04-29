

export abstract class BaseColor {
    public abstract toString(showAlpha?: boolean): string;
    public abstract equal(color: BaseColor): boolean;

    protected round(value: number, decimals: number = 2): number {
        const factor = Math.pow(10, decimals);
        return Math.round(value * factor) / factor;
    }
}
