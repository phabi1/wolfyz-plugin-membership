import { Button, Modal } from "@wordpress/components";
import { Link, useNavigate, useParams } from "react-router";
import Form from "../../components/forms/Form";
import { useState } from "react";
import SubscriptionsService from "../../services/subscriptions";
import { useForm } from "react-hook-form";
import FileField from "../../components/forms/fields/FileField";

export default function ImportPage() {
    const { campaignId } = useParams();
    const navigate = useNavigate();

    const [view, setView] = useState<'form' | 'processing' | 'result' | 'error'>('form');

    const form = useForm({
        defaultValues: {
            file: null,
        },
    });

    const handleImport = (data: any) => {
        setView('processing');
        SubscriptionsService.import(campaignId!, data.file)
            .then(() => {
                setView('result');
            })
            .catch((error) => {
                // Handle error, e.g., show an error message
                setView('error');
            });
    }

    const handleRetry = () => {
        form.reset();
        setView('form');
    }

    const handleClose = () => {
        navigate(`/campaign/${campaignId}/subscriptions`);
    }

    return (
        <Modal title={`Import Members for Campaign ${campaignId}`} onRequestClose={handleClose}>
                {view === 'form' && (
                    <Form form={form} onSubmit={handleImport}>
                        <FileField name="file" accept=".csv" />
                        <div style={{ display: 'flex', gap: 8, marginTop: 12 }}>
                            <Button type="button" onClick={handleClose}>Close</Button>
                            <Button variant="primary" type="button" onClick={form.handleSubmit(handleImport)}>Import</Button>
                        </div>
                    </Form>
                )}
                {view === 'processing' && (
                    <div>Processing import...</div>
                )}
                {view === 'result' && (
                    <div>
                        <div>Import completed!</div>
                        <Button onClick={handleClose}>Close</Button>
                    </div>
                )}
                {view === 'error' && (
                    <div>
                        <div>There was an error during import. Please try again.</div>
                        <Button onClick={handleRetry}>Retry</Button>
                    </div>
                )}
        </Modal>
    );
}