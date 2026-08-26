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

$requestId = absint($_GET['request_id'] ?? 0);
$token = sanitize_text_field($_GET['token'] ?? '');

$entityManager = \Wolf\Core\Plugin::getContainer()->get('wolf.entity.manager');

$campaignRepository = $entityManager->getRepository('wolf-memberships.campaign');
$requestRepository = $entityManager->getRepository('wolf-memberships.request');

$request = $requestRepository->findById($requestId);

if (!$request || $request->token !== $token) {
	echo '<p>' . esc_html__('Invalid request or token.', 'wolf-membership') . '</p>';
	return;
}


if ($request->status !== 'approved') {
	echo '<p>' . esc_html__('This request is not approved yet.', 'wolf-membership') . '</p>';
	return;
}

$campaign = $campaignRepository->findById($request->campaign_id);

$useCaseBus = \Wolf\Core\Plugin::getContainer()->get('wolf.use_case_bus');

$paymentMethods = [
	['name' => 'Credit Card', 'value' => 'credit_card'],
	['name' => 'Credit Card x3', 'value' => 'credit_card_x3'],
	['name' => 'Bank Transfer', 'value' => 'bank_transfer'],
	['name' => 'Check', 'value' => 'check'],
];

if (isset($_GET['payment_method']) && !empty($_GET['payment_method'])) {

	$paymentMethod = sanitize_text_field($_GET['payment_method']);

	$pay = $useCaseBus->execute('wolf-memberships.calculate_registration_total', [
		'campaign_id' => $campaign->id,
		'participants' => $request->data->participants ?? [],
	]);


	if (!in_array($paymentMethod, array_column($paymentMethods, 'value'))) {
		echo '<p>' . esc_html__('Invalid payment method.', 'wolf-membership') . '</p>';
		return;
	}

	$res = $useCaseBus->execute('wolf-memberships.pay', [
		'campaign' => $campaign,
		'request' => $request,
		'payment_method' => $paymentMethod,
		'pay' => $pay,
	]);

	if (is_string($res['redirect_url'] ?? '')) {
		wp_redirect($res['redirect_url']);
		exit;
	} else {
		echo '<p>' . esc_html__('Failed to generate payment URL.', 'wolf-membership') . '</p>';
		return;
	}
}




$pageUrl = get_permalink(get_option('wolf_membership_pay_page', 0));

?>


<div <?php echo get_block_wrapper_attributes(); ?>>
	<p>
		<?php echo esc_html__('Please select a payment method to complete your registration:', 'wolf-membership'); ?>
	</p>
	<?php
	foreach ($paymentMethods as $method) {
		?>
		<div>
			<a href="<?php echo esc_url(add_query_arg([
				'request_id' => $requestId,
				'token' => $token,
				'payment_method' => $method['value'],
			], $pageUrl)); ?>">
				<?php echo esc_html($method['name']); ?>
			</a>
		</div>
		<?php
	}
	?>
</div>