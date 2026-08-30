import { FormProvider } from 'react-hook-form';

export default function Form({ children, form, onSubmit }: any) {

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		e.stopPropagation();
		form.handleSubmit(onSubmit)();
	};

	return (
		<FormProvider {...form}>
			<form onSubmit={handleSubmit}>{children}</form>
		</FormProvider>
	);
}
