

export abstract class BaseColor {
    public abstract toString(showAlpha?: boolean): string;
    public abstract equal(color: BaseColor): boolean;
}
