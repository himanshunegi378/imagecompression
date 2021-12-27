export function Sidebar({ name, width, height, size, onChange }) {
    return <div>
        <div>
            <label>Name</label>
            <input type='text' value={name} onChange={(e) => onChange({ name: e.target.value })} />
        </div>
        <div>
            <h5>Dimensions</h5>
            <div>
                <div>
                    <label>W</label>
                    <input type='number' value={width} onChange={(e) => onChange({ width: Number(e.target.value) })} />
                </div>
                <div>
                    <label>H</label>
                    <input type='number' value={height} onChange={(e) => onChange({ height: Number(e.target.value) })} />
                </div>
            </div>
        </div>
    </div>
}