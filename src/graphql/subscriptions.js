/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const onCreateReservation = /* GraphQL */ `
  subscription OnCreateReservation(
    $filter: ModelSubscriptionReservationFilterInput
  ) {
    onCreateReservation(filter: $filter) {
      id
      meetingContent
      attendees
      startStr
      endStr
      createdAt
      updatedAt
      __typename
    }
  }
`;
export const onUpdateReservation = /* GraphQL */ `
  subscription OnUpdateReservation(
    $filter: ModelSubscriptionReservationFilterInput
  ) {
    onUpdateReservation(filter: $filter) {
      id
      meetingContent
      attendees
      startStr
      endStr
      createdAt
      updatedAt
      __typename
    }
  }
`;
export const onDeleteReservation = /* GraphQL */ `
  subscription OnDeleteReservation(
    $filter: ModelSubscriptionReservationFilterInput
  ) {
    onDeleteReservation(filter: $filter) {
      id
      meetingContent
      attendees
      startStr
      endStr
      createdAt
      updatedAt
      __typename
    }
  }
`;
