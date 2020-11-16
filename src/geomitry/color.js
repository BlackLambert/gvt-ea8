// Copyright: Sebastian Baier (sebastian.baier93@hotmail.de) 2020


class Color
{
    constructor(r, g, b, a) {
        this.r = r;
        this.g = g;
        this.b = b;
        this.a = a;
    }

    toArray()
    {
        return [this.r, this.g, this.b, this.a];
    }

    static black()
    {
        return new Color(0.0,0.0,0.0,1.0);
    }
    static white()
    {
        return new Color(1.0,1.0,1.0,1.0);
    }
    static blue()
    {
        return new Color(0.0,0.0,1.0,1.0);
    }
    static red()
    {
        return new Color(1.0,0.0,0.0,1.0);
    }

    static random()
    {
        let r = Math.random();
        let g = Math.random();
        let b = Math.random();
        let max = Math.max(r, g, b);
        r = r / max;
        g = g / max;
        b = b / max;
        return new Color(r,g,b,1.0);
    }

    lerp(other, value)
    {
        value = clamp(value, 0, 1);
        let dr = (other.r - this.r) * value;
        let dg = (other.g - this.g) * value;
        let db = (other.b - this.b) * value;
        let da = (other.a - this.a) * value;
        return new Color(this.r + dr, this.g + dg, this.b + db, this.a + da);
    }
}