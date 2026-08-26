import { Button } from '@wordpress/components';
import {
	DragDropContext,
	Draggable,
	Droppable,
	OnDragEndResponder,
} from 'react-beautiful-dnd';

export type UiCollectionProps = {
	items: any[];
	renderItem: ( item: any, index: number ) => React.ReactNode;
	onAddItem?: () => void;
	onRemoveItem?: ( index: number ) => void;
	onItemClicked?: ( index: number ) => void;
	onMoveItems?: ( items: any[] ) => void;
	addLabel?: string;
	emptyText?: string;
};

export default function UiCollection( {
	items,
	renderItem,
	onAddItem,
	onRemoveItem,
	onItemClicked,
	onMoveItems,
	addLabel,
	emptyText,
}: UiCollectionProps ) {
	const handleDragEnd: OnDragEndResponder = ( result: any ) => {
		if ( ! result.destination ) {
			return;
		}
		const reorderedItems = Array.from( items );
		const [ removed ] = reorderedItems.splice( result.source.index, 1 );
		reorderedItems.splice( result.destination.index, 0, removed );
		if ( onMoveItems ) {
			onMoveItems( reorderedItems );
		}
	};
	return (
		<DragDropContext onDragEnd={ handleDragEnd }>
			<div>
				{ onAddItem && (
					<Button variant="secondary" onClick={ onAddItem }>
						{ addLabel || 'Add Item' }
					</Button>
				) }
				<div>
					{ items.length === 0 && (
						<div style={ { padding: 8, textAlign: 'center' } }>
							{ emptyText || 'No items available.' }
						</div>
					) }
					<Droppable droppableId="droppable-list">
						{ ( provided: any ) => (
							<div
								ref={ provided.innerRef }
								{ ...provided.droppableProps }
							>
								{ items.map( ( item, index ) => (
									<Draggable
										key={ index }
										draggableId={ `draggable-${ index }` }
										index={ index }
									>
										{ ( provided: any, snapshot: any ) => (
												<div
												key={ index }
												ref={ provided.innerRef }
													style={ {
													border: '1px solid rgb(220,220,220)',
													padding: '8px',
													marginBottom: '8px',
													borderRadius: '4px',
														display: 'flex',
														gap: '8px',
														alignItems: 'center',
													...( snapshot.isDragging
														? {
																background:
																	'rgb(235,235,235)',
														  }
														: {} ),
												} }
												onClick={ () =>
													onItemClicked &&
													onItemClicked( index )
												}
												{ ...provided.draggableProps }
											>
												{ onMoveItems && (
													<div
														style={ {
															cursor: 'move',
															userSelect: 'none',
														} }
														{ ...provided.dragHandleProps }
													>
														::
													</div>
												) }
												<div style={ { flex: 1 } }>
													{ renderItem(
														item,
														index
													) }
												</div>
												<div>
													{ onRemoveItem && (
														<Button
															variant="tertiary"
															onClick={ () =>
																onRemoveItem(
																	index
																)
															}
														>
															x
														</Button>
													) }
												</div>
											</div>
										) }
									</Draggable>
								) ) }
								{ provided.placeholder }
							</div>
						) }
					</Droppable>
				</div>
			</div>
		</DragDropContext>
	);
}
