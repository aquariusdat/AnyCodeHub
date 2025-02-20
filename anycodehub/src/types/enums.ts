enum EUserStatus{
    ACTIVE = 'ACTIVE',
    INACTIVE = 'INACTIVE',
    BLOCKED = 'BLOCKED'
}

enum EUserRole{
    ADMIN = 'ADMIN',
    GUEST = 'GUEST',
    MODERATOR = 'MODERATOR',
}

enum ECourseStatus{
    APPROVED = 'APPROVED',
    PENDING = 'PENDING',
    REJECTED = 'REJECTED'
}

enum ECourseLevel{
    BEGINNER = 'BEGINNER',
    INTERMEDIATE = 'INTERMEDIATE',
    ADVANCED = 'ADVANCED'
}

export {EUserStatus, EUserRole, ECourseStatus, ECourseLevel};