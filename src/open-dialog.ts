import * as Electron from 'electron';

import { Bounds, uiUrl } from './utils';

export function init(
	electron: typeof Electron,
	createWindow: (
		url: string,
		bounds?: Bounds,
		extraOptions?: Electron.BrowserWindowConstructorOptions,
	) => Electron.BrowserWindow,
) {
	function createOpenDialogWindow(
		options: Electron.OpenDialogOptions,
	): Promise<Electron.OpenDialogReturnValue> {
		return new Promise((resolve) => {
			electron.ipcMain.once('select-files', (_event: Event, arg: any) => {
				resolve(arg);
			});
			createWindow(uiUrl('file-selector-window', options));
		});
	}

	function showOpenDialog(
		browserWindow: Electron.BrowserWindow,
		options: Electron.OpenDialogOptions,
	): Promise<Electron.OpenDialogReturnValue>;

	function showOpenDialog(
		options: Electron.OpenDialogOptions,
	): Promise<Electron.OpenDialogReturnValue>;

	// TODO: don't allow opening more than one open dialog
	function showOpenDialog(
		arg0: Electron.BrowserWindow | Electron.OpenDialogOptions,
		arg1?: Electron.OpenDialogOptions,
	): Promise<Electron.OpenDialogReturnValue> {
		let options: Electron.OpenDialogOptions;
		if (arg0 instanceof Electron.BrowserWindow) {
			options = arg1 as Electron.OpenDialogOptions;
		} else {
			options = arg0 as Electron.OpenDialogOptions;
		}
		return createOpenDialogWindow(options);
	}

	electron.dialog.showOpenDialog = showOpenDialog;
}
