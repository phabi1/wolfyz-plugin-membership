<?php
/**
 * PHP file to use when rendering the block type on the server to show on the front end.
 *
 * The following variables are exposed to the file:
 *     $attributes (array): The block attributes.
 *     $content (string): The block default content.
 *     $block (WP_Block): The block instance.
 *
 * @see https://github.com/WordPress/gutenberg/blob/trunk/docs/reference-guides/block-api/block-metadata.md#render
 */
?>

<?php
$type = $_GET['type'] ?? '';
$externalId = absint($_GET['external_id'] ?? 0);
?>

<div <?php echo get_block_wrapper_attributes(); ?>>
	<?php echo $type ?>
	<?php
	if ($type === 'success'):
		?>
			<?php esc_html_e('Payment processed successfully!', 'wolf-membership'); ?>
		<?php
	elseif ($type === 'error'):
		?>
			<?php esc_html_e('Payment failed. Please try again.', 'wolf-membership'); ?>
		<?php
	elseif ($type === 'back'):
		?>
			<?php esc_html_e('Payment process was canceled. You can try again.', 'wolf-membership'); ?>
		<?php
	endif;
	?>
</div>