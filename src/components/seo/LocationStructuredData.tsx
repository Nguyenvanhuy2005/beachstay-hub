
import React from 'react';
import { Helmet } from 'react-helmet';

interface LocationStructuredDataProps {
  name: string;
  description?: string;
  address: {
    street: string;
    locality: string;
    region?: string;
    postalCode?: string;
    country: string;
  };
  phone?: string;
  email?: string;
  coordinates: {
    latitude: number;
    longitude: number;
  };
  image?: string;
  url?: string;
}

const LocationStructuredData: React.FC<LocationStructuredDataProps> = ({
  name,
  description,
  address,
  phone,
  email,
  coordinates,
  image,
  url
}) => {
  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    name,
    description,
    address: {
      '@type': 'PostalAddress',
      streetAddress: address.street,
      addressLocality: address.locality,
      addressRegion: address.region,
      postalCode: address.postalCode,
      addressCountry: address.country
    },
    geo: {
      '@type': 'GeoCoordinates',
      latitude: coordinates.latitude,
      longitude: coordinates.longitude
    },
    telephone: phone,
    email,
    image,
    url,
    priceRange: '$$$',
    openingHoursSpecification: {
      '@type': 'OpeningHoursSpecification',
      dayOfWeek: [
        'Monday',
        'Tuesday',
        'Wednesday',
        'Thursday',
        'Friday',
        'Saturday',
        'Sunday'
      ],
      opens: '00:00',
      closes: '23:59'
    }
  };

  return (
    <Helmet>
      <script type="application/ld+json">
        {JSON.stringify(structuredData)}
      </script>
    </Helmet>
  );
};

export default LocationStructuredData;
