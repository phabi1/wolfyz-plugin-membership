import { Button, Modal, } from '@wordpress/components';
import { __, sprintf } from '@wordpress/i18n';
import { useState, useMemo } from 'react';
import { useForm } from 'react-hook-form';
import Form from '../forms/Form';
import SelectField from '../forms/fields/SelectField';
import DatePickerField from '../forms/fields/DatePickerField';
import UiCollection from '../ui/Collection';
import WheelAssignmentService from '../../services/wheel-assignments';
import { WheelAssignment } from '../../models/wheel-assignment';
import { formatDate } from '../../pipes';
import { Wheel } from '../../models/wheel';

function WheelAssignmentItem({ item }: { item: WheelAssignment }) {
    const title = useMemo(() => {
        return item.wheel.title;
    }, [item])
    const subtitle = useMemo(() => sprintf(__('Assigned at %s', 'wolf-membership'), formatDate(item.assigned_at)), [item]);

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
        </div>
    );
}

export default function WheelAssigmentsForm({
    memberId, wheelAssignments, wheels, onAddWheelAssignment, onRemoveWheelAssignment }: { memberId: number, wheelAssignments: WheelAssignment[], wheels: Wheel[], onAddWheelAssignment?: (data: any) => void, onRemoveWheelAssignment?: (data: any) => void }) {

    const [open, setOpen] = useState(false);
    const [items, setItems] = useState(wheelAssignments || []);

    const form = useForm({
        defaultValues: {
            wheel_id: '',
            assigned_at: '',
        },
    });

    const wheelOptions = useMemo(() => {
        return wheels.map(wheel => ({
            value: wheel.id,
            label: wheel.title,
        }));
    }, [wheels]);

    const handleAddWheelAssignment = () => {
        setOpen(true);
    }

    const handleRemoveWheelAssignment = (index: number) => {
        try {
            const wheelAssignment = items[index];
            if (!wheelAssignment) {
                console.error("Wheel assignment not found at index:", index);
                return;
            }
            WheelAssignmentService.delete(memberId, wheelAssignment.id);
            setItems(prevItems => prevItems.filter((_, i) => i !== index));
            if (onRemoveWheelAssignment) {
                onRemoveWheelAssignment(wheelAssignment);
            }
        } catch (error) {
            console.error("Error removing wheel assignment:", error);
        }
    }

    const handleSaveWheelAssignment = async (data: any) => {
        try {
            const assignedAt = new Date(data.assigned_at);
            const item = await WheelAssignmentService.create(memberId, {
                wheel_id: +data.wheel_id,
                member_id: memberId,
                assigned_at: assignedAt
            });
            setOpen(false);
            setItems(prevItems => [...prevItems, item]);
            form.reset();
            if (onAddWheelAssignment) {
                onAddWheelAssignment(item);
            }
        } catch (error) {
            console.error("Error saving wheel assignment:", error);
        }
    };

    return (
        <>
            <UiCollection items={items} renderItem={(wheelAssignment) => (
                <WheelAssignmentItem item={wheelAssignment} />
            )} onAddItem={handleAddWheelAssignment} onRemoveItem={handleRemoveWheelAssignment} />
            {open ? (
                <Modal title="Wheel Assignment" onRequestClose={() => setOpen(false)}>
                    <Form form={form} onSubmit={handleSaveWheelAssignment}>
                        <SelectField name="wheel_id" label="Wheel" required options={wheelOptions} />
                        <DatePickerField name="assigned_at" label="Assigned At" required />
                        <Button variant="primary" type="submit">{__('Save', 'wolf-membership')}</Button>
                    </Form>
                </Modal>
            ) : null}
        </>
    );
}