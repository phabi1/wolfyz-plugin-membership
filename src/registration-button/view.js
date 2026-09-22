/**
 * Use this file for JavaScript code that you want to run in the front-end 
 * on posts/pages that contain this block.
 */

document
	.querySelectorAll( '.wp-block-wolf-membership-registration-button' )
	.forEach( ( element ) => {
		const campaignId = element.dataset.campaignId;
		const link = element.querySelector( 'a' );

		if ( ! link ) {
			return;
		}

		if ( ! campaignId ) {
			link.setAttribute( 'aria-disabled', 'true' );
			link.setAttribute( 'tabindex', '-1' );
			link.removeAttribute( 'href' );
			return;
		}

		const params = new URLSearchParams( window.location.search );
		params.set( 'campaign_id', campaignId );
		link.href = `${ window.location.pathname }?${ params.toString() }`;
	} );
