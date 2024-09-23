import * as React from 'react'
import './App.css'

const Mine = -1;

const createField = (size: number): number[] => {
    const field: number[] = new Array(size * size).fill(0);

    for (let i = 0; i < 1;) {
        const x = Math.floor(Math.random() * size);
        const y = Math.floor(Math.random() * size);

        if (field[y * size + x] === Mine) continue;

        field[y * size + x] = Mine;

        i += 1;
    }

    return field;
};

enum Mask {
    Transparent,
    Fill,
}

const mapMaskToView: Record<Mask, React.ReactNode> = {
    [Mask.Transparent]: null,
    [Mask.Fill]: ' ',
};

const App = () => {
    const size = 6;
    const dimension = new Array(size).fill(null);

    const [death, setDeath] = React.useState(false);
    const [field, setField] = React.useState<number[]>(() => createField(size));
    const [mask, setMask] = React.useState<Mask[]>(() => new Array(size * size).fill(Mask.Fill));

    return (
        <div>
            {dimension.map((_, y) => {
                return (<div key={y} style={{ display: "flex" }}>
                    {dimension.map((_, x) => {
                        return (<div
                            key={x}
                            style={{
                                display: "flex",
                                justifyContent: "center",
                                alignItems: "center",
                                width: 24,
                                height: 24,
                                margin: 1,
                                backgroundColor: death ? "red" : "grey",
                            }}
                            onClick={() => {
                                if (death) return;

                                if (mask[y * size + x] === Mask.Transparent) return;

                                const clearing: [number, number][] = [];

                                function clear(x: number, y: number) {
                                    if (x >= 0 && x < size && y >= 0 && y < size) {
                                        if (mask[y * size + x] === Mask.Transparent) return;

                                        clearing.push([x, y]);
                                    }
                                }

                                clear(x, y);

                                while (clearing.length) {
                                    const [x, y] = clearing.pop()!!;

                                    mask[y * size + x] = Mask.Transparent;

                                    if (field[y * size + x] !== 0) continue;
                                }

                                if (field[y * size + x] === Mine) {
                                    mask.forEach((_, i) => mask[i] = Mask.Transparent);

                                    setDeath(true);
                                }

                                setMask((prev) => [...prev]);
                            }}
                        >{
                            mask[y * size + x] !== Mask.Transparent
                                ? mapMaskToView[mask[y * size + x]]
                                : field[y * size + x] === Mine
                                    ? "💣"
                                    : field[y * size + x]
                        }</div>);
                    })}
                </div>);
            })}
        </div>
    )
};

export default App;