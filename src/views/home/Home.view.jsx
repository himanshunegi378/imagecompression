import { Link } from 'react-router-dom'

export function HomeView() {
    return <div>
        <ul>
            <li><Link to="/compress">Compress</Link></li>
            <li><Link to="/resize">Resize</Link></li>
        </ul>
    </div>
}