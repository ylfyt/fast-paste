import { toast } from '@zerodevx/svelte-toast';

export const showToast = (message: string, success: boolean = null) => {
	const theme: {
		[key: string]: string;
	} =
		success === null
			? null
			: success
			? {
					'--toastBackground': '#48BB78',
					'--toastBarBackground': '#2F855A',
			  }
			: {
					'--toastBackground': '#F56565',
					'--toastBarBackground': '#C53030',
			  };
	return toast.push(message, {
		theme,
	});
};
