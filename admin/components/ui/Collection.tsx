import { Button, Flex } from '@wordpress/components';
import {
	DragDropContext,
	Draggable,
	Droppable,
	OnDragEndResponder,
} from 'react-beautiful-dnd';

export type UiCollectionProps = {
	items: any[];
	renderItem: (item: any, index: number) => React.ReactNode;
	onAddItem?: () => void;
	onRemoveItem?: (index: number) => void;
	onItemClicked?: (index: number) => void;
	onMoveItems?: (items: any[]) => void;
	addLabel?: string;
	emptyText?: string;
};

export default function UiCollection({
	items,
	renderItem,
	onAddItem,
	onRemoveItem,
	onItemClicked,
	onMoveItems,
	addLabel,
	emptyText,
}: UiCollectionProps) {
	const handleDragEnd: OnDragEndResponder = (result: any) => {
		if (!result.destination) {
			return;
		}
		const reorderedItems = Array.from(items);
		const [removed] = reorderedItems.splice(result.source.index, 1);
		reorderedItems.splice(result.destination.index, 0, removed);
		if (onMoveItems) {
			onMoveItems(reorderedItems);
		}
	};

	const emptyStateStyle = {
		padding: 18,
		textAlign: 'center' as const,
		color: '#646970',
		border: '1px dashed #c3c4c7',
		borderRadius: 8,
		background: '#ffffff',
	};

	if (onMoveItems) {

		return (
			<DragDropContext onDragEnd={handleDragEnd}>
				<div >
					{onAddItem && (
						<Button type="button" variant="secondary" onClick={onAddItem} style={{ marginBottom: 12 }}>
							{addLabel || 'Add Item'}
						</Button>
					)}
					<div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
						{items.length === 0 && (
							<div style={emptyStateStyle}>
								{emptyText || 'No items available.'}
							</div>
						)}
						<Droppable droppableId="droppable-list">
							{(provided: any) => (
								<div
									ref={provided.innerRef}
									{...provided.droppableProps}
								>
									{items.map((item, index) => (
										<Draggable
											key={index}
											draggableId={`draggable-${index}`}
											index={index}
										>
											{(provided: any, snapshot: any) => (
												<div
													key={index}
													ref={provided.innerRef}

													onClick={() =>
														onItemClicked &&
														onItemClicked(index)
													}
													{...provided.draggableProps}
												>
													<div style={{
														border: '1px solid #dcdcde',
														padding: '10px 12px',
														marginBottom: '10px',
														borderRadius: '8px',
														display: 'flex',
														gap: '10px',
														justifyContent: 'space-between',
														alignItems: 'center',
														background: '#ffffff',
														boxShadow: snapshot.isDragging
															? '0 8px 20px rgba(0,0,0,0.12)'
															: '0 1px 0 rgba(0,0,0,0.03)',
														transform: snapshot.isDragging ? 'scale(1.01)' : 'none',
														transition: 'box-shadow 120ms ease, transform 120ms ease',
													}}>
														<div style={{ display: 'flex', alignItems: 'center', gap: 10, flex: 1 }}>
															{onMoveItems && (
																<div
																	style={{
																		cursor: 'move',
																		userSelect: 'none',
																		color: '#8c8f94',
																		fontSize: 16,
																		lineHeight: 1,
																		padding: '4px 2px',
																	}}
																	{...provided.dragHandleProps}
																>
																	::
																</div>
															)}
															<div style={{ flex: 1 }}>
																{renderItem(
																	item,
																	index
																)}
															</div>
														</div>
														<div>
															{onRemoveItem && (
																<Button
																	type="button"
																	variant="tertiary"
																	label="Remove item"
																	size="small"
																	onClick={() =>
																		onRemoveItem(
																			index
																		)
																	}
																>
																	Remove
																</Button>
															)}
														</div>
													</div>
												</div>
											)}
										</Draggable>
									))}
									{provided.placeholder}
								</div>
							)}
						</Droppable>
					</div>
				</div>
			</DragDropContext>
		);
	}
	return (<div >
		{onAddItem && (
			<Button type="button" variant="secondary" onClick={onAddItem} style={{ marginBottom: 12 }}>
				{addLabel || 'Add Item'}
			</Button>
		)}
		<div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
			{items.length === 0 && (
				<div style={emptyStateStyle}>
					{emptyText || 'No items available.'}
				</div>
			)}
			{items.map((item, index) => (

				<div
					key={index}

					onClick={() =>
						onItemClicked &&
						onItemClicked(index)
					}
				>
					<div style={{
						border: '1px solid #dcdcde',
						padding: '10px 12px',
						marginBottom: '10px',
						borderRadius: '8px',
						display: 'flex',
						gap: '10px',
						justifyContent: 'space-between',
						alignItems: 'center',
						background: '#ffffff',
						transition: 'box-shadow 120ms ease, transform 120ms ease',
					}}>
						<div style={{ display: 'flex', alignItems: 'center', gap: 10, flex: 1 }}>
							<div style={{ flex: 1 }}>
								{renderItem(
									item,
									index
								)}
							</div>
						</div>
						<div>
							{onRemoveItem && (
								<Button
									type="button"
									variant="tertiary"
									label="Remove item"
									size="small"
									onClick={() =>
										onRemoveItem(
											index
										)
									}
								>
									Remove
								</Button>
							)}
						</div>
					</div>
				</div>
			))}
		</div>
	</div>);
}
