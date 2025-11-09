import Sidebar from '../components/sidebar';
import './styles/global.css';

export default function Layout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <html lang="en">
            <body>
                <Sidebar />
                {children}
            </body>
        </html>
    );
}