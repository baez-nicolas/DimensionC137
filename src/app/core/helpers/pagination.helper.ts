export interface PaginationResult<T> {
  items: T[];
  totalItems: number;
  currentPage: number;
  totalPages: number;
  itemsPerPage: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

export class PaginationHelper {
  static paginate<T>(items: T[], page: number, itemsPerPage: number): PaginationResult<T> {
    const totalItems = items.length;
    const totalPages = Math.ceil(totalItems / itemsPerPage);
    const currentPage = Math.max(1, Math.min(page, totalPages));
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const paginatedItems = items.slice(startIndex, endIndex);

    return {
      items: paginatedItems,
      totalItems,
      currentPage,
      totalPages,
      itemsPerPage,
      hasNextPage: currentPage < totalPages,
      hasPreviousPage: currentPage > 1,
    };
  }

  static getPageNumbers(
    currentPage: number,
    totalPages: number,
    maxVisible: number = 7,
  ): (number | -1)[] {
    const pages: (number | -1)[] = [];

    if (totalPages <= maxVisible) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      const ellipsisThreshold = 4;

      if (currentPage <= ellipsisThreshold) {
        for (let i = 1; i <= 5; i++) {
          pages.push(i);
        }
        pages.push(-1);
        pages.push(totalPages);
      } else if (currentPage >= totalPages - (ellipsisThreshold - 1)) {
        pages.push(1);
        pages.push(-1);
        for (let i = totalPages - 4; i <= totalPages; i++) {
          pages.push(i);
        }
      } else {
        pages.push(1);
        pages.push(-1);
        for (let i = currentPage - 1; i <= currentPage + 1; i++) {
          pages.push(i);
        }
        pages.push(-1);
        pages.push(totalPages);
      }
    }

    return pages;
  }

  static calculatePageRange(page: number, itemsPerPage: number): { start: number; end: number } {
    const start = (page - 1) * itemsPerPage + 1;
    const end = page * itemsPerPage;
    return { start, end };
  }

  static getPageFromOffset(offset: number, itemsPerPage: number): number {
    return Math.floor(offset / itemsPerPage) + 1;
  }

  static getOffsetFromPage(page: number, itemsPerPage: number): number {
    return (page - 1) * itemsPerPage;
  }

  static isValidPage(page: number, totalPages: number): boolean {
    return page >= 1 && page <= totalPages;
  }

  static clampPage(page: number, totalPages: number): number {
    return Math.max(1, Math.min(page, totalPages));
  }

  static getNextPage(currentPage: number, totalPages: number): number | null {
    return currentPage < totalPages ? currentPage + 1 : null;
  }

  static getPreviousPage(currentPage: number): number | null {
    return currentPage > 1 ? currentPage - 1 : null;
  }

  static getFirstPage(): number {
    return 1;
  }

  static getLastPage(totalPages: number): number {
    return totalPages;
  }

  static isPaginationDisabled(
    direction: 'prev' | 'next',
    currentPage: number,
    totalPages: number,
  ): boolean {
    return direction === 'prev' ? currentPage === 1 : currentPage === totalPages;
  }

  static shouldShowEllipsis(page: number): boolean {
    return page === -1;
  }

  static isCurrentPage(page: number, currentPage: number): boolean {
    return page === currentPage;
  }
}
