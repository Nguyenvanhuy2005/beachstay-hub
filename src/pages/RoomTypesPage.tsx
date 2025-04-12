
// Inside the room card section
<Button asChild className="bg-beach-600 hover:bg-beach-700 text-beach-50">
  <Link to={`/dat-phong${searchFilters ? `?roomType=${room.id}&checkIn=${searchFilters.checkIn}&checkOut=${searchFilters.checkOut}&guests=${searchFilters.guests}` : ''}`}>
    <Calendar className="mr-2 h-4 w-4" />
    {language === 'vi' ? 'Đặt Ngay' : 'Book Now'}
  </Link>
</Button>
