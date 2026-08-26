import { Button, Modal } from '@wordpress/components';
import { __ } from '@wordpress/i18n';
import { useState, useMemo } from 'react';
import { useForm } from 'react-hook-form';
import Form from '../forms/Form';
import SelectField from '../forms/fields/SelectField';
import UiCollection from '../ui/Collection';
import SessionService from '../../services/sessions';
import { Session } from '../../models/session';
import { formatDay, formatTime } from '../../pipes';

function SessionItem({ session }: { session: Session }) {
    const title = useMemo(() => {
        const lesson = session.lesson;
        return formatDay(lesson.day) + " " + formatTime(lesson.lesson_start) + " - " + formatTime(lesson.lesson_end);
    }, [session])
    const subtitle = useMemo(() => session.lesson.title || '', [session]);
    const sessionId = session?.id ? `#${session.id}` : __('Pending', 'wolf-membership');

    return (
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 12 }}>
            <div style={{ minWidth: 0 }}>
                <div style={{ fontWeight: 600, color: '#1e1e1e', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {title}
                </div>
                <div style={{ marginTop: 2, fontSize: 12, color: '#6b7280' }}>
                    {subtitle}
                </div>
            </div>
            <span
                style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    height: 24,
                    padding: '0 10px',
                    borderRadius: 999,
                    fontSize: 12,
                    fontWeight: 600,
                    border: '1px solid #bfdbfe',
                    background: '#eff6ff',
                    color: '#1d4ed8',
                    whiteSpace: 'nowrap',
                }}
            >
                {sessionId}
            </span>
        </div>
    );
}

export default function SessionsForm({
    campaignId, subscriptionId, memberId, sessions, lessons, onAddSession, onRemoveSession }: { campaignId: number, subscriptionId: number, memberId: number, sessions: any[], lessons: any[], onAddSession?: (data: any) => void, onRemoveSession?: (session: any) => void }) {

    const [open, setOpen] = useState(false);
    const [items, setItems] = useState(sessions || []);

    const form = useForm({
        defaultValues: {
            lesson_id: '',
        },
    });

    const lessonOptions = useMemo(() => {
        return lessons.map(lesson => ({
            value: lesson.id,
            label: lesson.title,
        }));
    }, [lessons]);

    const handleAddSession = () => {
        setOpen(true);
    }

    const handleRemoveSession = (index: number) => {
        try {
            const session = items[index];
            if (!session) {
                console.error("Session not found at index:", index);
                return;
            }
            SessionService.delete(campaignId, session.id);
            setItems(prevItems => prevItems.filter((_, i) => i !== index));
            if (onRemoveSession) {
                onRemoveSession(session);
            }
        } catch (error) {
            console.error("Error removing session:", error);
        }
    }

    const handleSaveSession = async (data: any) => {
        try {
            const item = await SessionService.create(campaignId, { subscription_id: subscriptionId, lesson_id: data.lesson_id, member_id: memberId });
            setOpen(false);
            setItems(prevItems => [...prevItems, item]);
            form.reset();
            if (onAddSession) {
                onAddSession(data);
            }
        } catch (error) {
            console.error("Error saving session:", error);
        }
    };

    return (
        <>
            <UiCollection items={items} renderItem={(session) => (
                <SessionItem session={session} />
            )} onAddItem={handleAddSession} onRemoveItem={handleRemoveSession} />
            {open ? (
                <Modal title="Session" onRequestClose={() => setOpen(false)}>
                    <Form form={form} onSubmit={handleSaveSession}>
                        <SelectField name="lesson_id" label="Lesson" required options={lessonOptions} />
                        <Button variant="primary" type="submit">{__('Save', 'wolf-membership')}</Button>
                    </Form>
                </Modal>
            ) : null}
        </>
    );
}