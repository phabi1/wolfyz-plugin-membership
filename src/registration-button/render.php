<?php
$campaignId = absint($attributes['campaignId'] ?? 0);
$pageId = get_option('wolf_membership_registration_page');
$pageUrl = $pageId ? get_permalink($pageId) : home_url('/');

if ($campaignId) {
    $pageUrl = add_query_arg(['campaign_id' => $campaignId], $pageUrl);
}
?>
<div <?php echo get_block_wrapper_attributes(); ?>>
    <a href="<?php echo esc_url($pageUrl); ?>"><?php echo esc_html__('Register', 'wolf-membership'); ?></a>
</div>
