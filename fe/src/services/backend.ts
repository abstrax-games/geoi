export const backendURL = 'http://localhost:8080'

export class axFetch {
    static async request(method: string, url: string, data?: any) {
        // 如果有数据且是 GET 请求，生成 query string
        const queryString =
            data && method === 'GET' ? '?' + new URLSearchParams(data).toString() : ''
        try {
            const response = await fetch(backendURL + url + queryString, {
                method,
                headers: {
                    'Content-Type': 'application/json'
                },
                body: method !== 'GET' && data ? JSON.stringify(data) : undefined
            })

            // 如果响应状态不是 OK，抛出错误
            if (!response.ok) {
                throw new Error(`Error ${response.status}: ${response.statusText}`)
            }

            return response.json()
        } catch (error) {
            console.error('Fetch error:', error)
            throw error // 将错误抛出，以便调用方可以处理
        }
    }

    static get(url: string, data?: any) {
        return this.request('GET', url, data)
    }

    static post(url: string, data?: any) {
        return this.request('POST', url, data)
    }
}
