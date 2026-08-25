/**
 * Retrieves the translation of text.
 *
 * @see https://developer.wordpress.org/block-editor/reference-guides/packages/packages-i18n/
 */
import { __ } from '@wordpress/i18n';
import { useBlockProps, InspectorControls } from '@wordpress/block-editor';
import { PanelBody, SelectControl } from '@wordpress/components';
import { useEffect, useState } from '@wordpress/element';
import './editor.scss';

export default function Edit( { attributes, setAttributes } ) {
	const { campaignId } = attributes;
	const [ campaigns, setCampaigns ] = useState( [] );

	useEffect( () => {
		fetch( '/wp-json/wolf-memberships/v1/campaigns' )
			.then( ( response ) => response.json() )
			.then( ( data ) => {
				const items = Array.isArray( data?.items ) ? data.items : [];
				setCampaigns( items );
			} )
			.catch( () => setCampaigns( [] ) );
	}, [] );

	const options = [
		{ label: __( 'Choose a campaign', 'wolf-membership' ), value: '' },
		...campaigns.map( ( campaign ) => ( {
			label: campaign.title || campaign.name || `Campaign #${ campaign.id }`,
			value: String( campaign.id ),
		} ) ),
	];

	return (
		<>
			<div { ...useBlockProps() }>
				<p>
					{ campaignId
						? __( 'Campaign selected', 'wolf-membership' )
						: __( 'No campaign selected yet', 'wolf-membership' ) }
				</p>
			</div>

			<InspectorControls>
				<PanelBody title={ __( 'Campaign settings', 'wolf-membership' ) }>
					<SelectControl
						label={ __( 'Campaign', 'wolf-membership' ) }
						value={ campaignId ? String( campaignId ) : '' }
						options={ options }
						onChange={ ( value ) => {
							setAttributes( { campaignId: value ? Number( value ) : 0 } );
						} }
					/>
				</PanelBody>
			</InspectorControls>
		</>
	);
}
