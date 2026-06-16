namespace Domain.ValueObjects;

public sealed class PagedAssignmentResult<T>
{
    public IReadOnlyList<T> Items { get; }
    public int Page { get; }
    public int PageSize { get; }
    public int TotalCount { get; }
    public int TotalActive { get; }
    public int TotalUpcoming { get; }
    public int TotalHistory { get; }
    public int All { get; }
    public int TotalPages => TotalCount == 0 ? 0 : (int)Math.Ceiling(TotalCount / (double)PageSize);
    public bool HasNext => Page < TotalPages;
    public bool HasPrevious => Page > 1;

    public PagedAssignmentResult(
        IReadOnlyList<T> items,
        int page, int pageSize,
        int totalCount,
        int totalActive,
        int totalUpcoming,
        int totalHistory,
        int all
    )
    {
        Items = items;
        Page = page;
        PageSize = pageSize;
        TotalCount = totalCount;
        TotalActive = totalActive;
        TotalUpcoming = totalUpcoming;
        TotalHistory = totalHistory;
        All = all;
    }
}