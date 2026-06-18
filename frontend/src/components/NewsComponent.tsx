import { useEffect, useState } from 'react';
import { Card, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { api } from '../lib/axios.ts';

interface NewsItem {
    id: string;
    category: string;
    title: string;
    publishDate: string;
    readTimeMinutes: number;
    thumbnailUrl: string;
    contentUrl: string;
}

export function NewsComponent() {
    const [newsItems, setNewsItems] = useState<NewsItem[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchNews = async () => {
            try {
                setIsLoading(true);
                setError(null);

                const data: any = await api.get('/news?page=1');

                if (data?.items) {
                    setNewsItems(data.items.slice(0, 3));
                }
            } catch (err: any) {
                console.error('Error loading news feed:', err);

                if (err.response?.status === 401) {
                    setError('Your session has expired. Please sign in again.');
                } else {
                    setError('Unable to load latest news updates.');
                }
            } finally {
                setIsLoading(false);
            }
        };

        fetchNews();
    }, []);

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric',
        });
    };

    return (
        <div className="flex flex-col gap-4">
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-tight">
                Latest News
            </h3>

            {isLoading && (
                <div className="grid gap-4 md:grid-cols-3 animate-pulse">
                    {[1, 2, 3].map((n) => (
                        <div
                            key={n}
                            className="h-48 bg-slate-100 rounded-xl border border-slate-200/60"
                        />
                    ))}
                </div>
            )}

            {error && !isLoading && (
                <div className="p-4 text-xs text-red-600 bg-red-50 border border-red-100 rounded-lg">
                    {error}
                </div>
            )}

            {!isLoading && !error && (
                <div className="grid gap-4 md:grid-cols-3">
                    {newsItems.map((news) => (
                        <Card
                            key={news.id}
                            className="overflow-hidden border-slate-200/60 shadow-sm hover:shadow-md transition-shadow duration-200 cursor-pointer group"
                        >
                            <div className="relative aspect-[16/9] w-full bg-slate-100 overflow-hidden">
                                <img
                                    src={news.thumbnailUrl}
                                    alt={news.title}
                                    className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-300"
                                    loading="lazy"
                                />
                                <span className="absolute top-3 left-3 bg-white/95 backdrop-blur-xs px-2 py-0.5 rounded text-[10px] font-black uppercase text-slate-800 tracking-widest shadow-xs">
                                    {news.category}
                                </span>
                            </div>

                            <CardHeader className="p-4">
                                <CardTitle className="text-sm font-bold leading-tight text-slate-900 group-hover:text-slate-800 transition-colors line-clamp-2 min-h-[40px]">
                                    {news.title}
                                </CardTitle>
                                <CardDescription className="text-[11px] font-medium text-slate-400 mt-2">
                                    {formatDate(news.publishDate)} • {news.readTimeMinutes} min read
                                </CardDescription>
                            </CardHeader>
                        </Card>
                    ))}
                </div>
            )}
        </div>
    );
}
