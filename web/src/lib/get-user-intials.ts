function getInitials(name: string): string {
    const names = name.split(' ');
    const initials = names.map(part => part[0]).join('');
    return initials.toUpperCase();
}

export { getInitials }