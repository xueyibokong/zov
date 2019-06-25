function getError(option, xhr) {
	const msg = `cannot post ${option.action} ${xhr.status}'`
	const err = new Error(msg)
	err.status = xhr.status
	err.method = 'post'
	err.url = option.action
	return err
}

function getBody(xhr) {
	const text = xhr.responseText || xhr.response
	if (!text) {
		return text
	}

	try {
		return JSON.parse(text)
	} catch (e) {
		return text
	}
}

// option {
//  onProgress: (event: { percent: number }): void,
//  onError: (event: Error, body?: Object): void,
//  onSuccess: (body: Object): void,
//  data: Object,
//  filename: String,
//  file: File,
//  withCredentials: Boolean,
//  action: String,
//  headers: Object,
// }
export default function upload(option) {
	if (typeof XMLHttpRequest === 'undefined') {
		return
	}

	const xhr = new XMLHttpRequest()

	if (option.onProgress && xhr.upload) {
		xhr.upload.onprogress = function progress(e) {
			if (e.total > 0) {
				e.percent = (e.loaded / e.total) * 100
			}
			option.onProgress(e)
		}
	}

	const formData = new FormData()

	if (option.data) {
		Object.keys(option.data).map(key => {
			formData.append(key, option.data[key])
		})
	}

	formData.append(option.filename, option.file)

	xhr.onerror = function error(e) {
		option.onError(e)
	}

	xhr.onload = function onload() {
		if (xhr.status < 200 || xhr.status >= 300) {
			return option.onError(getError(option, xhr), getBody(xhr))
		}

		option.onSuccess(getBody(xhr), xhr)
	}

	xhr.open('post', option.action, true)

	if (option.withCredentials && 'withCredentials' in xhr) {
		xhr.withCredentials = true
	}

	const headers = option.headers || {}

	if (headers['X-Requested-With'] !== null) {
		xhr.setRequestHeader('X-Requested-With', 'XMLHttpRequest')
	}

	for (const h in headers) {
		if (headers.hasOwnProperty(h) && headers[h] !== null) {
			xhr.setRequestHeader(h, headers[h])
		}
	}
	xhr.send(formData)

	return xhr
}
