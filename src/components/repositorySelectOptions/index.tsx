import * as React from 'react';
import { Select } from 'antd';
import { Repository } from 'common/backend';

interface RepositoryInGroup {
  [groupId: string]: {
    groupId: string;
    groupName: string;
    repositories: Repository[];
  };
}

export default (repositories: Repository[]) => {
  let repositoryInGroup: RepositoryInGroup = {};
  repositories.forEach(o => {
    let group = repositoryInGroup[o.groupId];
    if (group) {
      group.repositories.push(o);
    } else {
      repositoryInGroup[o.groupId] = {
        groupId: o.groupId,
        groupName: o.groupName,
        repositories: [o],
      };
    }
  });
  return Object.values(repositoryInGroup).map(group => (
    <Select.OptGroup key={group.groupId} label={group.groupName}>
      {group.repositories.map(({ id, name }) => (
        <Select.Option key={id}> {name} </Select.Option>
      ))}
    </Select.OptGroup>
  ));
};
