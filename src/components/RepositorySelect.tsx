import React, { useMemo, useState, forwardRef, useCallback } from 'react';
import { Select } from 'antd';
import { Repository } from 'common/backend';
import { SelectProps } from 'antd/lib/select';
import { debounce } from 'lodash';

interface RepositoryInGroup {
  [groupId: string]: {
    groupId: string;
    groupName: string;
    repositories: Repository[];
  };
}

interface RepositorySelectProps extends SelectProps<string> {
  repositories: Repository[];
}

const RepositorySelect: React.FC<RepositorySelectProps> = ({ repositories, ...props }, ref) => {
  const [searchKey, _setSearchKey] = useState<string>();

  const setSearchKey = useCallback(debounce(_setSearchKey, repositories.length > 100 ? 500 : 0), [
    _setSearchKey,
    repositories,
  ]);

  const repositoryInGroup = useMemo(() => {
    const repositoryInGroup: RepositoryInGroup = {};
    repositories.forEach(o => {
      if (searchKey) {
        if (!o.name.includes(searchKey)) {
          return;
        }
      }
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
    return repositoryInGroup;
  }, [repositories, searchKey]);

  return (
    <Select {...props} allowClear showSearch onSearch={setSearchKey} ref={ref} filterOption={false}>
      {Object.values(repositoryInGroup).map(group => (
        <Select.OptGroup key={group.groupId} label={group.groupName}>
          {group.repositories.map(({ id, name, disabled }) => (
            <Select.Option disabled={disabled} key={id}>
              {name}
            </Select.Option>
          ))}
        </Select.OptGroup>
      ))}
    </Select>
  );
};

export default forwardRef(RepositorySelect);
