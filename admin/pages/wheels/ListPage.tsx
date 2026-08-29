import Page from '../../components/ui/Page';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router';
import CampaignService from '../../services/campaigns';

export default function WheelsListPage() {
    const { campaignId } = useParams();
    const [loading, setLoading] = useState(true);
    const [wheels, setWheels] = useState<{ wheel_id: number; wheel_title: string; count: number }[]>([]);

    useEffect(() => {
        if (!campaignId) return;

        const fetchWheels = async () => {
            const data = await CampaignService.currentWheels(+campaignId);
            setWheels(data.items);
            setLoading(false);
        };
        fetchWheels();

    }, [campaignId]);

    return (
        <Page title="Wheels List">
            {loading ? (
                <p>Loading...</p>
            ) : (
                <ul>
                    {wheels.map((wheel) => (
                        <li key={wheel.wheel_id}>
                            {wheel.wheel_title} - {wheel.count}
                        </li>
                    ))}
                </ul>
            )}
        </Page>
    );
}